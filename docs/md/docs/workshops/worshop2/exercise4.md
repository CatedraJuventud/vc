# PhotoMosaic in Hardware
## Processing the dataset
To make a scalable solution, the dataset is previously concatenated. The images are ordered by brightness, from lowest to the highest brightness. The implementation was developed in Python, code below:

> :Tabs
> >:Tab title= Visualization
> >
> > > :P5 sketch=/docs/sketches/workshop2/exercise4/datasetExample.js, width=4050, height=64
>
> >:Tab title= Code
> >```python
> >import cv2
> >from glob import glob
> >from PIL import Image,ImageStat
> >import math
> >
> >def brightness( img_file ):
> >   im = Image.open(img_file)
> >   stat = ImageStat.Stat(im)
> >   r,g,b = stat.rms
> >   bright= math.sqrt(0.241*(r**2) + 0.691*(g**2) + 0.068*(b**2))
> >   return { 'brightness': bright, 'filename': img_file }
> >
> >def orderByBrightness(files):
> >  dataset= []
> >  for f in files:
> >    img_brightness = brightness(f)
> >    dataset.append(img_brightness)
> >  return sorted(dataset, key = lambda i: i['brightness'])
> >
> >files = glob("dataset/*.jpg")
> >dataset = orderByBrightness(files)
> >first = True
> >img_w = None
> >for i, data in enumerate(dataset):
> >  if i< 52: continue
> >  f = data['filename']
> >  if first:
> >    first=False
> >    img_w = cv2.imread(f)
> >    continue
> >  img = cv2.imread(f)
> >  img_w = cv2.hconcat([img_w, img])
> >
> >cv2.imwrite('concat_dataset.jpg', img_w)
> >```

## Final Results


> :P5 sketch=/docs/sketches/workshop2/exercise4/photomosaicHardware.js, width=600, height=600