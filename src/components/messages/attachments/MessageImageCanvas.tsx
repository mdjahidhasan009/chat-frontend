import { FC, useRef, useEffect } from "react";

type Props = {
  file: File;
};

export const MessageImageCanvas: FC<Props> = ({ file }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const image = new Image();
    image.src = URL.createObjectURL(file);
    image.onload = (e) => {
      const { current: canvas } = canvasRef;
      if (!canvas) return;
      const context = canvas.getContext('2d');
      const horizontalRatio = canvas.width / image.width;
      const verticalRatio = canvas.height / image.height;
      const ratio = Math.min(horizontalRatio, verticalRatio);
      const centerX = (canvas.width - image.width * ratio) / 2;
      const centerY = (canvas.height - image.height * ratio) / 2;
      context?.clearRect(0, 0, canvas.width, canvas.height);
      context?.drawImage(
        image,
        0,
        0,
        image.width,
        image.height,
        centerX,
        centerY,
        image.width * ratio,
        image.height * ratio
      );
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: '300px',
        height: '150px',
      }}
    ></canvas>
  );
};