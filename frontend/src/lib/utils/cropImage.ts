export function getCroppedImg(imageSrc: string, pixelCrop: any) {
    const image = new Image();
    image.src = imageSrc;
    return new Promise((resolve, reject) => {
      image.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
  
        if (!ctx) {
          reject("Falha ao obter contexto do canvas.");
          return;
        }
  
        const { width, height } = image;
        const scaleX = width / image.naturalWidth;
        const scaleY = height / image.naturalHeight;
  
        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;
  
        ctx.drawImage(
          image,
          pixelCrop.x * scaleX,
          pixelCrop.y * scaleY,
          pixelCrop.width * scaleX,
          pixelCrop.height * scaleY,
          0,
          0,
          pixelCrop.width,
          pixelCrop.height
        );
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const file = new File([blob], "cropped-image.png", {
                type: "image/png",
              });
              resolve(file);
            } else {
              reject("Falha ao gerar a imagem cortada.");
            }
          },
          "image/png",
          1
        );
      };
  
      image.onerror = () => {
        reject("Falha ao carregar a imagem.");
      };
    });
  }
  