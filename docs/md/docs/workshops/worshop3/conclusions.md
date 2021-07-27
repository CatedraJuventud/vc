
## Conclusions

- The closeness and distance of the projected objects are well represented by a perspective projection, and poor for an orthogonal projection
- anti-aliasing allows an image to suppress the effects of distortion in the rasterization process
- The representation of objects in three dimensions is usually carried out by their transformation into a polygonal mesh that is decomposed into triangles that are rasterized in the projection plane.
- The use of barycentric coordinates allows applying attributes to each pixel of the image, and even its algorithm is commonly implemented in the gpu.

## Future work
Rendering three-dimensional images on a two-dimensional canvas is a geometric, visibility and shading challenge. The production of more realistic scenes undoubtedly requires greater research efforts to give better experiences to users of video games, movies or other types of graphic content.

For future work we can research about lighting calculations in the traditional rasterization process do not take into account the obstruction of objects. Shadow mapping and shadow volumes are two common modern techniques for creating shadows. So it would be interesting to show this type of algorithms applied to the rasterization process to give a more realistic image perception.

Finally, We can also highlight for future work the handling of the number of polygons in a scene, which can be impressive. However, an observer in a scene will only be able to discern details from nearby objects. Level of detail algorithms vary the complexity of the geometry based on the distance to the observer. Objects directly in front of the observer can be shown in their full complexity while objects further away can be dynamically simplified.


