import { useRef, useState } from "react";

interface ImagePickerProps {
  onImage: (image: File) => void;
  onError: (error: string) => void;
}

const ImagePicker: React.FC<ImagePickerProps> = ({ onImage, onError }) => {
  const [previewImgURL, setPreviewURL] = useState<string | null>(null);
  const fileUploadRef = useRef<any>(null);
  const handleImageChange = async () => {
    const uploadedFile: File = fileUploadRef.current.files[0];
    const uploadedFileType: string = uploadedFile.type.split("/")[0];
    if(uploadedFileType != "image") {
      onError("Invalid image type provided");
      return;
    }
    setPreviewURL(URL.createObjectURL(uploadedFile));
    onImage(uploadedFile);
  };

  return (
    <div className="pol-img-preview-box" onClick={(e) => {
      fileUploadRef.current.click();
    }}>
      {previewImgURL && <img src={previewImgURL}></img>}
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