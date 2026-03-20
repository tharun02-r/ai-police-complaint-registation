from PIL import Image
import sys

def remove_white(image_path, output_path):
    try:
        img = Image.open(image_path)
        img = img.convert("RGBA")
        datas = img.getdata()
        
        newData = []
        for item in datas:
            # Change white (also shades of white) to transparent
            if item[0] > 235 and item[1] > 235 and item[2] > 235:
                newData.append((255, 255, 255, 0))
            else:
                newData.append(item)
                
        img.putdata(newData)
        img.save(output_path, "PNG")
        print("Success")
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

remove_white(
    r"C:\Users\Admin\.gemini\antigravity\brain\c7225caa-49ce-4857-9b3e-100040b14c59\media__1774024752512.png", 
    r"C:\Users\Admin\Desktop\police-hackethon\web\public\logo.png"
)
