import React, { useState } from "react";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "@/lib/utils/cropImage";
import { notify } from "@/lib/utils/utils";

type AvatarCropperProps = {
  image: string;
  onCropComplete: (croppedImage: File) => void;
};

const AvatarCropper: React.FC<AvatarCropperProps> = ({
  image,
  onCropComplete,
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const onCropChange = (newCrop: { x: number; y: number }) => {
    setCrop(newCrop);
  };

  const onZoomChange = (newZoom: number) => {
    setZoom(newZoom);
  };

  const onCropCompleteHandler = async (
    croppedArea: any,
    croppedAreaPixels: any
  ) => {
    setCroppedAreaPixels(croppedAreaPixels);

    try {
        const croppedImage = await getCroppedImg(image, croppedAreaPixels);
        
        // Fazendo o cast explícito para File
        onCropComplete(croppedImage as File);
      } catch (error) {
        notify.error("Erro ao cortar a imagem.");
      }
  };

  return (
    <div className="relative w-[300px] h-[300px]">
      <Cropper
        image={image}
        crop={crop}
        zoom={zoom}
        aspect={1}
        onCropChange={onCropChange}
        onZoomChange={onZoomChange}
        onCropComplete={onCropCompleteHandler}
      />
    </div>
  );
};

export default AvatarCropper;
