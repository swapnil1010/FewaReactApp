import React, { useState, createRef, useEffect } from 'react';
import { View, TextInput, Text, SafeAreaView, ImageBackground, Button, StyleSheet, TouchableOpacity, TouchableHighlight } from 'react-native';
import { color } from 'react-native-reanimated';
import global from './Components/Global';
import Svg, { Path } from 'react-native-svg'
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNPrint from 'react-native-print';

const ReportScreen = ({ navigation }) => {
  const [userEmail, setUserEmail] = useState('');
  const [errortext, setErrortext] = useState('');

  const passwordInputRef = createRef();
  const handlePatientValid = (userEmail) => {
    if (!userEmail) {
      setErrortext('Email is required');
      setTimeout(() => {
        setErrortext();
      }, 3000);
      return;
    }
    else {
      setErrortext('')
    }
  }
  const adviceList = "";
  useEffect(() => {
    global.providerAdvice = "";
    for (var i = 0; i < global.patient.advice.length; i++) {
      adv = global.patient.advice[i].advice;
      value = global.patient.advice[i].isChecked == true ? 'Yes' : 'No';
      global.providerAdvice += "<tr><td style ='font-size:25;padding:10px;color: grey;'>" +
        "<b>" + adv + ":</b>&nbsp;" + value + "</td></tr>";
    }
  }, []);

  const slash = "/";
  const key = "73l3M3D";
  const handleEmailSendPress = () => {
    // setErrortext('');
    if (!userEmail) {
      alert('Please fill email');
      return;
    }
    global.patient.email = userEmail;
    global.patient.key = key;
    fetch(global.url + 'Messenger/EmailPatientReport?key=' + key, {
      method: 'POST',
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        'Authorization': 'Bearer ' + global.token
      },

      body: JSON.stringify(
        global.patient,
      )
    })
      .then(
        res => res.json()
      )
      .then(json => {
        console.log(json)
      }

      )
      .catch((error) =>
        console.error(error)
      )
  };
  const printHTML = async () => {
    await RNPrint.print({
      html:
        '<h1 style="text-align:center;font-size:50;font-weight:bold;">' + global.practice + '</h3>' +
        '<h2 style="text-align:center;font-size:30;font-weight:bold;">Thank You For Consulting ' + global.obj.provider + '</h2>' +
        '<h2 style="text-align:center;font-size:30;font-weight:bold;">Visit Summary</h2><br>' +
        '<table style="width:100%">' +
        '<tr>' +
        '<td style="font-size:25;padding:10px;">Follow Up in: ' + adv + '</td>' +
        '</tr>' +
        '<tr>' +
        '<td style="font-size:25;padding:10px;">Advice: ' + global.patient.medication + '</td>' +
        '</tr>' +
        '<tr>' +
        '<td style="font-size:25;padding:10px;">Follow Up in: ' + global.patient.followUpNumber + slash + global.patient.followUpMeasure + '</td>' +
        '</tr>' +
        '</table>'

    });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* <View style={{flex: 1, padding: 16}}> */}
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <ImageBackground
          source={require('../Image/patient-bg.png')}
          style={{
            flex: 1,
            width: 385,
            height: 700,
            padding: 20
          }}>
          <View style={styles.registerTextStyle}>
            <Text style={{ fontSize: 25, fontWeight: 'bold' }}>{global.practice}</Text>
          </View>
          <View style={{ backgroundColor: 'white', padding: 10 }}>
            <View style={{
              padding: 5, alignItems: 'center', justifyContent: 'center', fontSize: 30,
              textAlign: 'center',
              marginBottom: 20
            }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Thank You For Consulting {global.obj.providerNameAttending}</Text>
            </View>
            <View style={{
              borderColor: 'grey', padding: 5,
              borderWidth: 0.5
            }}>

              <View style={{
                padding: 5, alignItems: 'center', justifyContent: 'center', fontSize: 30,
                textAlign: 'center',
                marginBottom: 20
              }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Visit Summary</Text>
              </View >
              <View style={styles.contentTextStyle1}>
                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>What we did today?  </Text>
                {
                  global.patient.advice.map((item, idx) => {
                    return <View key={idx} style={{ flexDirection: 'column' }}>
                      <Text style={{ fontSize: 16, color: 'grey' }}>{item.advice} :  {item.isChecked ? 'Yes' : 'No'}</Text>
                    </View>
                  })
                }
              </View>
              <View style={styles.contentTextStyle}>
                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Advice  </Text>
                <Text style={{ fontSize: 16, color: 'grey' }}>{global.patient.medication}</Text>
              </View>
              <View style={styles.contentTextStyle}>
                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Follow Up in  </Text>
                <Text style={{ fontSize: 16, color: 'grey' }}>{global.patient.followUpNumber}/{global.patient.followUpMeasure}</Text>
              </View>
            </View>
            <View style={{
              padding: 10, alignItems: 'center', justifyContent: 'center', fontSize: 30,
              textAlign: 'center', fontWeight: 'bold',
              marginBottom: 20
            }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Send your report to your email!.</Text>
            </View>
            <View style={{
              alignItems: 'flex-start', justifyContent: 'space-between', fontSize: 30, flexDirection: 'row',
              // textAlign: 'center',
              marginBottom: 20
            }}>
              <View style={styles.SectionStyle}>
                <TextInput
                  style={styles.emailStyle}
                  onChangeText={(UserEmail) =>
                    setUserEmail(UserEmail)
                  }
                  placeholder="Enter email address " //dummy@abc.com
                  placeholderTextColor="#8b9cb5"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  underlineColorAndroid="#f000"
                  blurOnSubmit={false}
                  onEndEditing={(e) => handlePatientValid(e.nativeEvent.text)}
                />
              </View>
              {errortext != '' ? (
                <Text style={styles.errorTextStyle}>
                  {errortext}
                </Text>
              ) : null}
              <TouchableOpacity
                style={styles.buttonStyle}
                activeOpacity={0.5}
                onPress={handleEmailSendPress}>
                <Text style={styles.buttonTextStyle}>Send</Text>
              </TouchableOpacity>
              <Text style={{ paddingVertical: 10, fontWeight: 'bold', color: 'grey' }}>OR</Text>
              <View style={{ marginTop: 5 }}>
                {/* <Svg viewBox="0 0 475.078 475.077" width="25" height="25" xmlns="http://www.w3.org/2000/svg" >
              <Path onPress={printHTML} class="svg"fill="#000" d="M458.959,217.124c-10.759-10.758-23.654-16.134-38.69-16.134h-18.268v-73.089c0-7.611-1.91-15.99-5.719-25.122
                    c-3.806-9.136-8.371-16.368-13.699-21.698L339.18,37.683c-5.328-5.325-12.56-9.895-21.692-13.704
                    c-9.138-3.805-17.508-5.708-25.126-5.708H100.5c-7.614,0-14.087,2.663-19.417,7.993c-5.327,5.327-7.994,11.799-7.994,19.414V200.99
                    H54.818c-15.037,0-27.932,5.379-38.688,16.134C5.376,227.876,0,240.772,0,255.81v118.773c0,2.478,0.905,4.609,2.712,6.426
                    c1.809,1.804,3.951,2.707,6.423,2.707h63.954v45.68c0,7.617,2.664,14.089,7.994,19.417c5.33,5.325,11.803,7.994,19.417,7.994
                    h274.083c7.611,0,14.093-2.669,19.418-7.994c5.328-5.332,7.994-11.8,7.994-19.417v-45.68h63.953c2.471,0,4.613-0.903,6.42-2.707
                    c1.807-1.816,2.71-3.948,2.71-6.426V255.81C475.082,240.772,469.708,227.876,458.959,217.124z M365.449,420.262H109.636v-73.087
                    h255.813V420.262z M365.449,237.537H109.636V54.816h182.726v45.679c0,7.614,2.669,14.083,7.991,19.414
                    c5.328,5.33,11.799,7.993,19.417,7.993h45.679V237.537z M433.116,268.656c-3.614,3.614-7.898,5.428-12.847,5.428
                    c-4.949,0-9.233-1.813-12.848-5.428c-3.613-3.61-5.42-7.898-5.42-12.847s1.807-9.232,5.42-12.847
                    c3.614-3.617,7.898-5.426,12.848-5.426c4.948,0,9.232,1.809,12.847,5.426c3.613,3.614,5.427,7.898,5.427,12.847
                    S436.733,265.046,433.116,268.656z"/>
               </Svg> */}

                <Text onPress={printHTML} style={{ fontWeight: 'bold' }}>Print</Text>
              </View>

              {/* <Text style={styles.buttonTextStyle}>Print</Text> */}
            </View>
          </View>

        </ImageBackground >
      </View>
    </SafeAreaView>
  );
};

export default ReportScreen;

const styles = StyleSheet.create({

  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 16,
  },
  registerTextStyle: {
    color: '#FFFFFF',
    textAlign: 'center',
    alignSelf: 'center',
    padding: 25,
  },

  contentTextStyle: {
    padding: 5, alignItems: 'flex-start', justifyContent: 'flex-start',
    textAlign: 'center',
    marginBottom: 20, flexDirection: 'row'
  },
  contentTextStyle1: {
    padding: 5, alignItems: 'flex-start', justifyContent: 'flex-start',
    textAlign: 'center',
    marginBottom: 20
  },
  SectionStyle: {
    flexDirection: 'row',
    height: 40,
    width: 60,
    color: 'black',
  },
  emailStyle: {
    flex: 1,
    color: 'black',
    minWidth: 145,
    borderWidth: 1,
    borderColor: 'grey',
  },
  buttonStyle: {
    backgroundColor: '#3F51B5',
    borderWidth: 0,
    color: 'white',
    borderColor: '#7DE24E',
    height: 40,
    alignItems: 'center',
    width: 60,
    marginLeft: 80,
  },
  buttonStyle1: {
    backgroundColor: '#3F51B5',
    borderWidth: 0,
    color: 'white',
    borderColor: '#7DE24E',
    height: 40,
    alignItems: 'center',
    width: 60
  },
});