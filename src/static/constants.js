// names and names list :kappa:
'use strict';

var namesList = ['participant_1', 'participant_2', 'participant_3'];

var categories = ['Extraversion', 'Agreeableness', 'Conscientiousness', 'Neuroticism', 'Openness to Experience'];

var colors = {
  red: d3.color('#f44336'),
  blue: d3.color('#0D47A1'),
  purple: d3.color('#9c27b0'),
  cyan: d3.color('#00bcd4'),
  green: d3.color('#4CAF50'),
  gray: d3.color('#9E9E9E'),
  yellow: d3.color('#FFEB3B'),
  orange: d3.color('#FF9800'),
  brown: d3.color('#795548')
};

var names = {
  participant_1: { color_name: 'red', data: null, image: 'images/test-image.png' },
  participant_2: { color_name: 'green', data: null, image: 'images/test-image.png' },
  participant_3: { color_name: 'blue', data: null, image: 'images/test-image.png' }
};

var materialColors = {};
var reportText = {};

var allDataPromise = Promise.all([loadMaterialColors(), loadDataIntoName('participant_1'), loadDataIntoName('participant_2'), loadDataIntoName('participant_3'), loadReportText()]);

var transparent = 'rgba(255, 255, 255, 0.0)';
var body = d3.select('body');
var margin = {
  top: 50,
  bottom: 50,
  left: 50,
  right: 50
};
var container = d3.select(".container");
var containerWidth = 0;
var containerHeight = 0;
var chartWidth = 0;
var chartHeight = 0;
var svg = null;

var currentPage = 'index';
var initialLoad = false;