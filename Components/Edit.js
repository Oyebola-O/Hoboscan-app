import React, { useState, useRef } from 'react';
import { Header, Icon } from 'native-base';
import { Dimensions, Share, View, StyleSheet, TextInput, Keyboard, Clipboard, TouchableOpacity, Picker } from 'react-native';
import config from '../config';
import languages from '../languages';

const Edit = ({ route, navigation }) => {
	let KEY = config.TRANSKEY;
	let ENDPOINT = config.TRANSENDPOINT;
	let data = route.params == undefined ? "" : route.params.text.analyzeResult.readResults[0].lines;
	const textArea = useRef(null)

	const extractString = (text) => {
		if(text == "") return ""
		let string = "";
		for(let i = 0; i < data.length; i++){
			string += data[i].text + '\n'
		}
		return string;
	}

	const [string, setString] = useState(extractString(data));

	const share = async() => {
		// Add Alert here
		try {
			let title = string.split('\n')[0];
			await Share.share({title, message: string});
		} catch (error) {
			console.log(error);
		}
	}


	const parseLang = (lang) => {
		let translation = JSON.parse(lang)
		setString(translation[0].translations[0].text);
	}

	const translate = async(language) => {
		try {
			let headers = new Headers();
			headers.append("Content-Type", "application/json");
			headers.append("Ocp-Apim-Subscription-Key", KEY);
			let raw = JSON.stringify([{"Text":string}]);
			let requestOptions = {
				method: 'POST',
				headers: headers,
				body: raw,
				redirect: 'follow'
			}
			const url = `${ENDPOINT}${language}`;
			console.log(url)
			fetch(url, requestOptions)
  			.then(response => response.text())
  			.then(result => parseLang(result))
  			.catch(error => console.log('error', error));
		} catch (error) {
			console.log('error', error);
		}
	}

	const lang = Object.keys(languages);
	const code = Object.values(languages);

	const pickerItems = lang.map((language, index) => (<Picker.Item key={index} label={language} value={code[index]} />));
	const {height, width} = Dimensions.get('window');
	const [showTranslate, setShowTranslate] = useState(false);
	const [toLanguage, setToLanguage] = useState(null);


	return (
		<View style={{ flex: 1 }}>
			<Header style={styles.header}>
				<View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-around' }} >
					<TouchableOpacity onPress={() => navigation.navigate('Camera')}>
						<Icon type='Ionicons' name='ios-arrow-back' style={{ fontSize: 25 }} />
					</TouchableOpacity>

					<TouchableOpacity onPress={() => share()}>
						<Icon type='Ionicons' name='ios-share' style={{ fontSize: 25 }} />
					</TouchableOpacity>
					
					<TouchableOpacity onPress={() => {
						Keyboard.dismiss();
						showTranslate == true ? setShowTranslate(false) : setShowTranslate(true)
					}}>
						<Icon type='Entypo' name='language' style={{ fontSize: 25 }} />
					</TouchableOpacity>

					<TouchableOpacity onPress={() => Clipboard.setString(string)}>
						<Icon type='MaterialIcons' name='content-copy' style={{ fontSize: 25 }} />
					</TouchableOpacity>

					<TouchableOpacity onPress={()=> Keyboard.dismiss()}>
						<Icon type='MaterialIcons' name='keyboard-hide' style={{ fontSize: 25 }} />
					</TouchableOpacity>
				</View>
			</Header>

			
			<TouchableOpacity onPress={()=> textArea.current.focus()} style={{top: 30, height:height*0.7}} activeOpacity={0.8}>
				<TextInput style={styles.text}
				ref={textArea}
				defaultValue = {string} multiline={true} onChangeText={(text) => {setString(text)}}/>
			</TouchableOpacity>

			{
				showTranslate && 
				<View style={{backgroundColor:'rgb(248, 248, 248)', padding:20}}>
					<TouchableOpacity onPress={()=> translate(toLanguage)} style={styles.translate}>
						<Icon type='FontAwesome' name='language' style={{ fontSize: 35 }} />
					</TouchableOpacity>
					<Picker 
					style={styles.picker}
					selectedValue={toLanguage}
					itemStyle={{ backgroundColor:'rgb(248, 248, 248)'}}
					onValueChange={(itemValue, itemIndex) => setToLanguage(itemValue)}
					>
						{pickerItems}
					</Picker>
				</View>
			}
		</View>
	);
}

const styles = StyleSheet.create({
	header: {
		position: 'absolute',
		justifyContent: 'space-between',
		top: 30,
		borderBottomWidth: 0,
		zIndex: 100
	},

	text: {
		top:20,
		paddingTop: 20,
		paddingLeft: 30,
		paddingRight: 30
	},

	translate: {
		alignSelf: 'center',
		zIndex: 20
	},

	picker: {
		flex: 1,
		alignSelf: 'stretch',
		bottom: 30
	}
});

export default Edit;