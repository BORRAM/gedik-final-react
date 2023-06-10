import devtools from '../node_modules/devtools-detect/index.js';
import logo from './Akasya_Duragi.png';
import axios from 'axios';
import { faAddressCard, faAt, faGlobe, faMale, faPhone, faUser } from '@fortawesome/free-solid-svg-icons';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import devTools from '../node_modules/devtools-detect/index.js';
const MySwal = withReactContent(Swal)

let SinanUckagitAudio = new Audio('/SinanUckagit.mp3');
let SucluYakalamaAudio = new Audio('/SucluYakalama.mp3');
let SasirmaAudio = new Audio('/Sasirma.mp3');
let AliKefalAudio = new Audio('/AcLanKapiyi.mp3');

function App() {
  const [inputs, setInputs] = useState({
    adsoyad: '',
    gender: '1',
    uyrugu: '',
    sbelge: '',
    telephone: '',
    email: '',
    onay: false
  });
  const [mounted, setMounted] = useState("not mounted");

  const handleInputChange = (event) => {
    setInputs(prevInputs => ({ ...prevInputs, [event.target.name]: event.target.value }));

    // Checkbox
    if (event.target.name === 'onay') {
      setInputs(prevInputs => ({ ...prevInputs, [event.target.name]: event.target.checked }));
    }

    console.log(inputs);
  }

  const startSasirma = () => {
    SasirmaAudio.currentTime = 1;
    SasirmaAudio.play();
    SasirmaAudio.volume = 0.7;

    setTimeout(() => {
      SasirmaAudio.pause();
    }, 5000);
  }

  const startSinanUckagit = () => {
    SinanUckagitAudio.play();
    SinanUckagitAudio.volume = 0.7;

    setTimeout(() => {
      SinanUckagitAudio.pause();
    }, 5000);
  }

  const startSucluYakalama = () => {
    SucluYakalamaAudio.play();
    SucluYakalamaAudio.volume = 0.1;
  }

  const stopSucluYakalama = () => {
    SucluYakalamaAudio.pause();
  }

  const startAliKefal = () => {
    // Play from beginning
    AliKefalAudio.currentTime = 3;
    AliKefalAudio.play();
    AliKefalAudio.volume = 0.2;
  }

  const stopAliKefal = () => {
    AliKefalAudio.pause();
  }

  useEffect(() => {
    setInterval(() => {
      if (devtools.isOpen) {
        if (AliKefalAudio.paused) {
          stopSucluYakalama();
          startAliKefal();
        }
      } else {
        if (!AliKefalAudio.paused) {
          stopAliKefal();
          startSucluYakalama();
        }
      }
    }, 250);

    if (mounted === "mounted") {
      return;
    }

    setMounted("mounted");

    // Popup
    MySwal.fire({
      title: 'Hoşgeldiniz!',
      text: 'Lütfen formu dikkatlice doldurunuz.',
      icon: 'info',
      confirmButtonText: 'Tamam',
      allowOutsideClick: false,
      showCancelButton: false,
      showCloseButton: false,
    }).then((result) => {
      if (result.isConfirmed) {
        startSucluYakalama();
      }
    });
  }, []);

  const handleSubmit = (event) => {
    if (!devTools.isOpen) {
      stopSucluYakalama();
    }
    if (event) {
      event.preventDefault();
    }

    const payloadData = {
      fullName: inputs.adsoyad,
      gender: inputs.gender,
      nationality: inputs.uyrugu,
      licenseType: inputs.sbelge,
      telephone: inputs.telephone,
      email: inputs.email,
      agreement: inputs.onay
    };

    if (!payloadData.agreement) {
      MySwal.fire({
        title: 'Hata!',
        text: 'Lütfen onay kutucuğunu işaretleyiniz.',
        icon: 'error',
        confirmButtonText: 'Tamam'
      });

      return;
    }

    console.log(payloadData);

    const payloadFormData = new FormData();
    for (const key in payloadData) {
      payloadFormData.append(key, payloadData[key]);
    }

    axios.post('/registration.php', payloadFormData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then((response) => {
        console.log(response);
        if (response.data.status === 'success') {
          MySwal.fire({
            title: 'Başarılı!',
            text: `${payloadData.fullName} başvurunuz alınmıştır. En kısa sürede sizinle iletişime geçilecektir.`,
            icon: 'success',
            confirmButtonText: 'Tamam'
          });

          if (!devTools.isOpen) {
            stopSucluYakalama();
            startSinanUckagit();
          }
        } else {
          MySwal.fire({
            title: 'Hata!',
            text: 'Bir hata oluştu. Lütfen tekrar deneyiniz. (Hata: ' + response.data.message + ')',
            icon: 'error',
            confirmButtonText: 'Tamam'
          });

          if (!devTools.isOpen) {
            stopSucluYakalama();
            startSasirma();
          }
        }
      }
      )
      .catch((error) => {
        console.log(error);
        MySwal.fire({
          title: 'Hata!',
          text: 'Bir hata oluştu. Lütfen tekrar deneyiniz.',
          icon: 'error',
          confirmButtonText: 'Tamam'
        });

        if (!devTools.isOpen) {
          stopSucluYakalama();
          startSasirma();
        }
      }
      );

    if (!devTools.isOpen) {
      setTimeout(() => {
        startSucluYakalama();
      }, 5000);
    }

  }

  return (
    <div className="App">

      <div className="container">
        <div className="row">
          <div>
            <div className="register-form">
              <img src={logo} className="akasyaLogo" alt="Akasya Durağı" width="50%" />
              <form onSubmit={handleSubmit}>
                <h3 className="text-center">ŞOFÖR KAYIT FORMU</h3>
                <p className="hint-text">Lütfen formu dikkatlice doldurunuz.(*) alanlar boş bırakılamaz</p>
                <div className="form-group">
                  <div className="input-group"><span className="input-group-addon"><FontAwesomeIcon icon={faUser} /></span>
                    <input type="text" name="adsoyad" className="form-control" placeholder="Ad Soyad" value={inputs.adsoyad || ""} required="required" onChange={handleInputChange}></input>
                  </div>
                </div>
                <div className="form-group">
                  <div className="input-group"><span className="input-group-addon"><FontAwesomeIcon icon={faMale} /></span>
                    <select name="gender" className="form-control" required="required" value={inputs.gender || '1'} onChange={handleInputChange}>
                      <option value="1">Erkek</option>
                      <option value="2">Kadın</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <div className="input-group"><span className="input-group-addon"><FontAwesomeIcon icon={faGlobe} /></span>
                    <input type="text" name="uyrugu" placeholder="Uyruğu" className="form-control" value={inputs.uyrugu || ""} required="required" onChange={handleInputChange}></input>
                  </div>
                </div>

                <div className="form-group">
                  <div className="input-group"><span className="input-group-addon"><FontAwesomeIcon icon={faAddressCard} /></span>
                    <input type="text" name="sbelge" className="form-control" placeholder="Sürücü belgesi (A,B,A2..)"
                      required="required" onChange={handleInputChange} value={inputs.sbelge || ""}></input>
                  </div>
                </div>
                <div className="form-group">
                  <div className="input-group"><span className="input-group-addon"><FontAwesomeIcon icon={faPhone} /></span>
                    <input type="text" name="telephone" className="form-control" placeholder="Telefon Numarası"
                      required="required" value={inputs.telephone || ""} onChange={handleInputChange}></input>
                  </div>
                </div>
                <div className="form-group">
                  <div className="input-group"><span className="input-group-addon"><FontAwesomeIcon icon={faAt} /></span>
                    <input type="text" name="email" className="form-control" placeholder="E-posta adresi" required="required" value={inputs.email || ""} onChange={handleInputChange}></input>
                  </div>
                </div>
                <hr>
                </hr>
                <div className="form-group">
                  <label className="checkbox-inline form-control-581">
                    <input type="checkbox" name="onay" checked={!!inputs.onay || false} onChange={handleInputChange}></input>Bilgileri Onaylıyorum
                  </label>
                </div>
                <div className="row">
                  <div>
                    <div className="form-group">
                      <input type="submit" value="KAYDET" className="btn btn-warning btn-block btn-block" tabIndex="7"></input>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
