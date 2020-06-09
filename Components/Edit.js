import React, { useState, useRef, useEffect } from 'react';
import { Header, Icon } from 'native-base';
import { Dimensions, Share, View, StyleSheet, TextInput, Keyboard, Clipboard, TouchableOpacity, Picker, Alert } from 'react-native';
import config from '../config';
import languages from '../languages';

const Edit = ({ route, navigation, changePage }) => {
	let KEY = config.TRANSKEY;
	let ENDPOINT = config.TRANSENDPOINT;

	const translateAlert = () => {
        Alert.alert(
			"Ayyy! It seems we could not translate this one",
			"",
            [{ text: "OK"}],
            { cancelable: true }
        );
	}

	const emptyText = () => {
        Alert.alert(
			"Ayyy! There was no text in this image so we'll just leave you with an empty page :)",
			"",
            [{ text: "OK"}],
            { cancelable: true }
        );
    }

	const extractString = () => {
		if(route.params == undefined) {
			return ""
		} else {
			let data = route.params.text.analyzeResult.readResults[0].lines;
			let string = "";
			for(let i = 0; i < data.length; i++){
				string += data[i].text + '\n'
			}
			return string;
		}
	}

	const textArea = useRef(null);
	const [string, setString] = useState(extractString());

	const share = async() => {
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
			let res = await fetch(url, requestOptions);
			if(res.status == 200){
				res = await res.text()
				parseLang(res)
			} else {
				translateAlert()
			}
		} catch (error) {
			console.log('error', error);
			translateAlert()
		}
	}

	const lang = Object.keys(languages);
	const code = Object.values(languages);

	const pickerItems = lang.map((language, index) => (<Picker.Item key={index} label={language} value={code[index]} />));
	const {height, width} = Dimensions.get('window');
	const [showTranslate, setShowTranslate] = useState(false);
	const [toLanguage, setToLanguage] = useState(null);

	useEffect(()=> {
		let str = extractString();
		setString(str);
		if(route.params != undefined && str == "") { emptyText() }
	},[route.params])


	return (
		<View style={{ flex: 1 }}>
			<View style={styles.header}>
				<View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-around' }} >
					<TouchableOpacity style={styles.buttons} onPress={() => {changePage(0) }}>
						<Icon type='Ionicons' name='ios-arrow-back' style={{ fontSize: 25 }} />
					</TouchableOpacity>

					<TouchableOpacity style={styles.buttons} onPress={() => share()}>
						<Icon type='Ionicons' name='ios-share' style={{ fontSize: 25 }} />
					</TouchableOpacity>
					
					<TouchableOpacity style={styles.buttons} onPress={() => {
						Keyboard.dismiss();
						showTranslate == true ? setShowTranslate(false) : setShowTranslate(true)
					}}>
						<Icon type='Entypo' name='language' style={{ fontSize: 25 }} />
					</TouchableOpacity>

					<TouchableOpacity style={styles.buttons} onPress={() => Clipboard.setString(string)}>
						<Icon type='MaterialIcons' name='content-copy' style={{ fontSize: 25 }} />
					</TouchableOpacity>

					<TouchableOpacity style={styles.buttons} onPress={()=> Keyboard.dismiss()}>
						<Icon type='MaterialIcons' name='keyboard-hide' style={{ fontSize: 25 }} />
					</TouchableOpacity>
				</View>
			</View>

			
			<TouchableOpacity style={{top: 30, height:height*0.9}} activeOpacity={0.8}>
				<TextInput 
				style={{
					height:height*0.9,
					top:20,
					textAlignVertical: "top",
					paddingTop: 35,
					paddingLeft: 30,
					paddingRight: 30
				}}
				ref={textArea}
				defaultValue = {string} multiline={true} onChangeText={(text) => {setString(text)}}/>
			</TouchableOpacity>

			{
				showTranslate && 
				<View style={styles.translateBox}>
					<TouchableOpacity onPress={()=> translate(toLanguage)} style={styles.translate}>
						<Icon type='FontAwesome' name='language' style={{ fontSize: 35 }} />
					</TouchableOpacity>
					<Picker 
					style={styles.picker}
					selectedValue={toLanguage}
					itemStyle={{ backgroundColor:'rgb(210, 210, 210)'}}
					onValueChange={(itemValue, itemIndex) => setToLanguage(itemValue)}
					mode='dropdown'
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
		flex:1,
		flexDirection:'row',
		backgroundColor: 'rgb(242, 242, 242)',
		width:'100%',
        paddingTop:45,
        paddingLeft:20,
		paddingRight:20,
		justifyContent: 'space-between',
		zIndex: 100
	},

	translateBox: {
		backgroundColor:'rgb(210, 210, 210)', 
		bottom: 0,
		padding:20, 
		position: "absolute", 
		width:'100%'
	},

	translate: {
		alignSelf: 'center',
		padding:5,
		shadowColor: 'black',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 10,  
        elevation: 5,
		zIndex: 20
	},

	picker: {
		flex: 1,
		alignSelf: 'stretch',
		bottom: 30
	},

	buttons: {
		padding:7
	}
});

export default Edit;