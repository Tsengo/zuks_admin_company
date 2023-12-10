
export  const _handleUploadAssets = (e,setFile) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      const fileType = selectedFile.type;

      const allowedTypes = ["image/png", "image/jpeg", "image/svg+xml"];

      if (!allowedTypes.includes(fileType)) {
        e.target.value = null;
        setFile(null);
        return;
      }
    }
  };



 export  const _handleUploadProductImage = async (e,setFile,setShowImageFilesWithBlobs) => {
  const selectedFiles = e.target.files;
  
  if (selectedFiles) {
    const fileArray = Array.from(selectedFiles);
    const allowedTypes = ["image/png", "image/jpeg", "image/svg+xml"];

  

    const reducedFiles = await Promise.all(
      fileArray.map((file) => _reduceImageQuality(file))
    );
    
    setFile(reducedFiles);
    
    // Read the files and create URLs for each
    const fileURLs = reducedFiles.map((file) => URL.createObjectURL(file));
    setShowImageFilesWithBlobs(fileURLs);
  }
};








  export const _reduceImageQuality = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
  
        
          const maxWidth = 630;
          const maxHeight = 440;
  
          let width = img.width;
          let height = img.height;
  
          
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width *= ratio;
            height *= ratio;
          }
  
      
          canvas.width = width;
          canvas.height = height;
  
          
          ctx.drawImage(img, 0, 0, width, height);
  
         
          canvas.toBlob((blob) => {
            resolve(blob);
          }, "image/jpeg", 0.7); // Adjust the quality value as desired
        };
  
        img.src = e.target.result;
      };
  
      reader.readAsDataURL(file);
    });
  };