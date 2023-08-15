import RNFetchBlob from 'rn-fetch-blob';
const { config, fs } = RNFetchBlob;

import { Platform, PermissionsAndroid } from "react-native"

const downloadFile = (fileUrl: string) => {

  // Get today's date to add the time suffix in filename
  let date = new Date();
  // File URL which we want to download
  let FILE_URL = fileUrl;
  // Function to get extention of the file url
  let file_ext = getFileExtention(FILE_URL);
  // config: To get response by passing the downloading related options
  // fs: Root directory path to download

  let RootDir = Platform.select({ ios: fs.dirs.DocumentDir, android: fs.dirs.DownloadDir });

  let options = Platform.select({
    android: {
      fileCache: true,
      addAndroidDownloads: {
        path: RootDir + '/file_' + Math.floor(date.getTime() + date.getSeconds() / 2) + file_ext,
        description: 'downloading file...',
        notification: true,
        // useDownloadManager works with Android only
        useDownloadManager: true,
      },
    },

    ios: {
      fileCache: true,
      path: RootDir + '/file_' + Math.floor(date.getTime() + date.getSeconds() / 2) + file_ext,
      notification: true,
    }
  });

  
  config(options)
  .fetch('GET', FILE_URL)
  .then(res => {
    // Alert after successful downloading
    console.log('res -> ', JSON.stringify(res));
    alert('File Downloaded Successfully.');
    // console.log(`RootDir: RootDir ${RootDir}`)
  });
};

const getFileExtention = fileUrl => {
  // To get the file extension
  // return /[.]/.exec(fileUrl) ?
  //          /[^.]+$/.exec(fileUrl) : undefined;

  let split = fileUrl.split(".")
  let fileExt = split[split.length - 1]
  return `.${fileExt}`

};
 
// Function to check the platform
// If Platform is Android then check for permissions.
export const checkDownloadPerPlatform = async (fileUrl: string) => {

  if (Platform.OS === 'ios') {
    downloadFile(fileUrl);
  } else {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission Required',
          message: 'Application needs access to your storage to download File',
          buttonPositive: "Allow"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // Start downloading
        downloadFile(fileUrl);
        console.log('Storage Permission Granted.');
      } else {
        // If permission denied then show alert
        // Alert.alert('Error', 'Storage Permission Not Granted');
        console.log('Error', 'Storage Permission Not Granted');
      }
    } catch (err) {
      // To handle permission related exception
      console.log("++++" + err);
    }
  }
};