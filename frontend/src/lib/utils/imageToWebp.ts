import imageCompression from "browser-image-compression";

export const convertToWebP = async (file: File): Promise<File> => {
  const options = {
    maxWidthOrHeight: 512,
    maxSizeMB: 0.3,
    useWebWorker: true,
    fileType: "image/webp",
  };

  const compressedBlob = await imageCompression(file, options);
  return new File([compressedBlob], `${crypto.randomUUID()}.webp`, {
    type: "image/webp",
  });
};
