
export const convertToBase64 = async (e, name) => {
  var image = {
    documentName: "",
    base64: "",
  };
  const file = e.target.files[0];

  const imageName = name.toLowerCase().replace(/\s+/g, "_") + '_' + e.target.id;

  image.documentName = imageName;
  const reader = new FileReader();

  // Use a Promise to wait for the reader to load.
  const fileLoadPromise = new Promise((resolve, reject) => {
    reader.onload = () => {
      let base64 = reader.result;
      base64 = base64.substring(base64.indexOf(",") + 1);
      // Assuming isBase64 is a valid function
      isBase64(base64);
      image.base64 = base64;
      resolve();
    };

    reader.onerror = (error) => {
      reject(error);
    };
  });

  reader.readAsDataURL(file);
  await fileLoadPromise; // Wait for the FileReader to finish loading the file.

  return image;
};


const isBase64 = (str) => {
  const base64Regex =
    /^(?:[A-Za-z0-9+/]{4})*?(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
  if (!base64Regex.test(str)) {
    console.log("base64 not valid");
  } else {
    console.log("base64 valid");
  }
};

export const validateFileSize = (e) => {
  const fileSizeLimit = 1000000; //1MB in bytes
  const file = e.target.files[0];

  if (file && file.size <= fileSizeLimit) {
    return true;
  } else {
    // alert(`File size should be less than ${fileSizeLimit / 1000000}MB`);
    return false;
  }
};
