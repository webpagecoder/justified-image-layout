# Justified Image Layout

A Javascript class to create a justified image gallery. It is very similar to what can be seen on sites like Flickr.com. The justified images gallery is also responsive to sizing changes, if desired.

![justified-layout-screenshot](https://user-images.githubusercontent.com/115098866/196555029-7edb128d-530c-4b76-85f1-7a7715d75530.png)

## Sample usage

First, define your container element and create a series of ratio patterns. Each array entry corresponds to a row. In the example below, four pattern rows have been defined. The first row will have 3 images, the second row 4 images, etc. If you have more images than your defined pattern, then the pattern will repeat itself as much as it needs to fill up your justified gallery. 
```
const container = document.getElementById('#container');
const ratios = [
    [0.25, 0.4, 0.35],
    [5, 4, 2, 4],
    [0.2, 0.3, 0.5],
    [2/3, 1/3],
];

```

Next, populate an image array with filenames:

```
const images = [];
for (let i = 1; i <= 20; ++i) {
    images.push(i + '.jpg');
}
```

Finally, create your JustifiedImageLayout object and draw it:

```
const justifiedImageLayout = new JustifiedImageLayout(
    container,
    ratios,
    images, 
    {
      smallSizeDir: "./photos/small/",
      largeSizeDir: "./photos/large/",
      rowHeight: '175px',
      imagePadding: '10px',
      expandFinalImage: true,
      // Using the bootstrap modal library below to pop images to larger size (optional)
      onClickImage: (imageUrl) => {
          const modal = document.getElementById('image-pop-modal');
          document.getElementById('modal-image').src = imageUrl;
          let myModal = new bootstrap.Modal(modal, {});
          myModal.show();
          modal.addEventListener('click', function () {
              myModal.hide();
          });
      }
   }
);

justifiedImageLayout.draw();
```

## Options are as follows:

- smallSizeDir: Directory to prepend for images in justified gallery (default: '')
- largeSizeDir: Directory to prepend for higher resolution images (default: '')
- rowHeight: Height for each row (default: 150px)
- padding: Padding between images (default: 10px)
- expandFinalImage: Expand the final image to take up the rest of the row if needed (default: true)
- enableAutoLoad: Enable autoloading of images (default: true)
- autoLoadAmount: Amount of images to autoload (default: 50)
- onClickImage: Function to run upon image being clicked. This is where you might use something like bootstrap to display a modal that shows the larger image - see the examples folder. (default: (imgName) => { })


## Live example
You can view [https://slick.photos](https://slick.photos) to see a live version of JustifiedImageLayout. The justified photos are also clickable. Larger versions of images are displayed in a pop-up modal.
