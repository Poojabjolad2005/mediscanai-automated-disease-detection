/**
 * Utility to optimize and downscale medical scans and photos before uploading.
 * Reduces raw 10-30MB camera/radiograph images into optimal 1200-1600px diagnostic
 * tensors (~200KB-500KB) to prevent network drops, proxy body-size overflows,
 * and "Failed to fetch" browser exceptions.
 */

export async function optimizeImageForAnalysis(
  input: File | string,
  maxDimension = 1600,
  quality = 0.85
): Promise<{ dataUrl: string; sizeFormatted: string }> {
  return new Promise((resolve) => {
    // If input is already a short URL like /samples/...
    if (typeof input === 'string' && (input.startsWith('/') || input.startsWith('http://') || input.startsWith('https://')) && !input.startsWith('data:')) {
      resolve({ dataUrl: input, sizeFormatted: '2.1 MB' });
      return;
    }

    const processSrc = (src: string) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        try {
          let { width, height } = img;

          // Downscale if exceeds max dimension
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = Math.max(1, width);
          canvas.height = Math.max(1, height);
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            resolve({ dataUrl: src, sizeFormatted: formatBytes(src.length * 0.75) });
            return;
          }

          // Fill neutral background for transparent PNGs
          ctx.fillStyle = '#000000';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          const optimizedDataUrl = canvas.toDataURL('image/jpeg', quality);
          const approximateBytes = Math.round(optimizedDataUrl.length * 0.75);
          resolve({
            dataUrl: optimizedDataUrl,
            sizeFormatted: formatBytes(approximateBytes)
          });
        } catch {
          // Fallback to original src if canvas fails
          resolve({ dataUrl: src, sizeFormatted: formatBytes(src.length * 0.75) });
        }
      };

      img.onerror = () => {
        resolve({ dataUrl: src, sizeFormatted: formatBytes(src.length * 0.75) });
      };

      img.src = src;
    };

    if (typeof input === 'string') {
      processSrc(input);
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (!result) {
          resolve({ dataUrl: '', sizeFormatted: '0 KB' });
          return;
        }
        processSrc(result);
      };
      reader.onerror = () => {
        resolve({ dataUrl: '', sizeFormatted: '0 KB' });
      };
      reader.readAsDataURL(input);
    }
  });
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
