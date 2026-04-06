from PIL import Image

def remove_black():
    img = Image.open('public/logga1.png')
    img = img.convert("RGBA")
    datas = img.getdata()

    newData = []
    for item in datas:
        r, g, b, a = item
        max_val = max(r, g, b)
        if max_val < 25:
            # Change all pixels close to pure black to transparent
            newData.append((r, g, b, 0))
        elif max_val < 50:
            # Semi-transparent for edges smoothing
            alpha = int(((max_val - 25) / 25.0) * 255)
            # Ensure we don't increase alpha if original was transparent
            new_alpha = min(a, alpha)
            newData.append((r, g, b, new_alpha))
        else:
            newData.append(item)

    img.putdata(newData)
    img.save("public/logga1_trans.png", "PNG")

if __name__ == "__main__":
    remove_black()
    print("Background removed via python")
