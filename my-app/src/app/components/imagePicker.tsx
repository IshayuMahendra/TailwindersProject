import { useRef, useState } from "react";

const ImagePicker: React.FC = () => {
      const [imageFile, setImageFile] = useState<string|null>(null);
  const fileUploadRef = useRef<any>(null);
  const handleImageChange = async () => {
    const uploadedFile = fileUploadRef.current.files[0];
    setImageFile(URL.createObjectURL(uploadedFile));
  };

return (
    <div className="pol-img-preview-box" onClick={(e) => {
        fileUploadRef.current.click();
      }}>
        {imageFile && <img src={imageFile}></img>}
        <div>Select an Image</div>
        <input 
              type="file" 
              id="polImageUpload" 
              ref={fileUploadRef} 
              onChange={handleImageChange}
        hidden />
      </div>
)
}

export default ImagePicker;