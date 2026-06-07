import struct
import sys

def get_jpeg_size(filepath):
    try:
        with open(filepath, 'rb') as f:
            if f.read(2) != b'\xff\xd8':
                return None
            while True:
                marker_bytes = f.read(2)
                if not marker_bytes or len(marker_bytes) < 2:
                    break
                marker, = struct.unpack('>H', marker_bytes)
                if marker == 0xffd9 or marker == 0xffda:
                    break
                size_bytes = f.read(2)
                if not size_bytes or len(size_bytes) < 2:
                    break
                size, = struct.unpack('>H', size_bytes)
                if 0xffc0 <= marker <= 0xffc3:
                    f.read(1) # precision
                    h_bytes = f.read(2)
                    w_bytes = f.read(2)
                    height, = struct.unpack('>H', h_bytes)
                    width, = struct.unpack('>H', w_bytes)
                    return width, height
                else:
                    f.read(size - 2)
    except Exception as e:
        print("Error:", e)
    return None

if __name__ == '__main__':
    path = 'c:/Users/SHUBHAM/OneDrive/Desktop/ferrari - Copy/ferrari/src/assets/SF90 Stradale_Rosso Corsa.jpeg'
    print(get_jpeg_size(path))
