# BioViz-Tables
Biovisualization Assignment 3: Tables of Numbers

##### Overview
This is a visualization of the [Wisconsin Breast Cancer dataset](https://archive.ics.uci.edu/ml/datasets/Breast+Cancer+Wisconsin+%28Original%29), which tracks several characteristics of tissue samples. Each value ranges from 1-10, with 1 being the most normal state and 10 the most abnormal. Samples are additionally categorized as either Malignant (cancerous) or Benign. I interpreted the usefulness of the dataset as its ability to show the relationship between these characteristics and malignancy of the sample, to be used in cancer prediction and diagnosis.

I made a parallel coordinate plot, based on the example [here](http://bl.ocks.org/jasondavies/1341281), which provided the basic graph, brushing for highlight, and draggable axes. 

##### Updates
The first change that I made was mapping the diagnosis (malignant or benign) to the color of the line (red and blue). I did this because that is the most significant characteristic, and the purpose of using this visualization would be to see how other characteristics related to it.

I also processed the data to remove incomplete records, and combine duplicate records.Combined records were given an increased "weight", which is a value I added to represent how many entries were represented by one record. I then made the thickness and opacity of each line based on the square of its weight - this helped make it easier to see how many samples were represented in a line. This was especially important because the benign cells were clumped at the bottom of the chart, which made it less obvious that most of the samples were actually benign.

The last major change that I made was adding a stacked bar chart on the side that showed the proportion of malignant and benign cells. This helped overcome the issue of not being able to see relatively how many benign and malignant cells there were, since it explicitly shows the ratio and counts of each. This chart is especially useful because it updates as the axes are brushed, showing the filtered amounts. This makes it easy to see how limiting a parameter affects the amount or proportion of cell types. The user can see both how many of the selected cells are malignant vs benign, as well as the proportion of each type that are accounted for (e.g. 90% of malignant cells fall within that filter).

It is also possible to show only malignant or benign cells by clicking a portion of the bar chart. This was useful for

This visualization could support any set of records in this type, performance permitting.

#####Technical
* Colors for malignant and benign.
* Filtering of malignant and benign.
* Counting of malignant/benign.
* Side bar chart that updates in real-time with brushing.
* Processing to missing values and combine duplicates with increased weight.
* Widening and fading of lines based on weight.

#####Biological
* Tools for exploring the relationship between cell characteristics in breast tissue samples and presence of cancer. 

#####Running It
This must be run from a server, so start a server in the top-level folder of the assignment, and then visit it in your browser.