let selectedCategory = 'Extraversion';
let selectedUser = '';
let selectedDate = '';

let extra = d3.select('#Extraversion');
let agree = d3.select('#Agreeableness');
let consci = d3.select('#Conscientiousness');
let neuro = d3.select('#Neuroticism');
let open = d3.select('#Openness');

d3.select('svg').remove();

allDataPromise.then(function (allData) {

});

function setup() {
  let dates = pullOutDates(selectedUser);
  drawDateInputs(dates);
  let input = d3.select('.date:last-child').select('input');
  selectedDate = input.property('value');
  input.property('checked', true);
}

function displayScores() {
  reportText.categories.forEach(function(cat) {
    if (cat.category == selectedCategory) {
      let categoryDiv = d3.select('#categoryDiv');
      categoryDiv.select('#details').select('p').text(cat.details);
      let userResults = names[selectedUser].data.reports.find(function(report) {
        return report.date == selectedDate;
      });
      let userCategory = userResults.results.find(function(result) {
        return result.category == selectedCategory;
      });
      categoryDiv.select('#score').select('p').call(transitionNumber, userCategory.score);
      categoryDiv.select('#score').select('#title').text(getScoreTitle(userCategory.score));

      let facetData = Object.keys(userCategory.facets).map(function(key) {
        return {
          key: key,
          score: userCategory.facets[key],
          text: cat.facets[key]
        }
      });
      let facetDivs = d3.select('#facetsDiv').selectAll('.facet-div').data(facetData, function(d) {
        return d.key + d.score;
      });
      facetDivs.exit().remove();
      let mainFacetDiv = facetDivs.enter().append('div')
        .attr('class', 'facet-div');
      mainFacetDiv.append('p')
        .attr('class', 'underline');
      let innerFacetDiv = mainFacetDiv.append('div');
      let facetScoreDiv = innerFacetDiv.append('div')
        .attr('class', 'category-score');
      facetScoreDiv.append('p')
        .attr('class', 'score');
      facetScoreDiv.append('p')
        .attr('class', 'score-title');
      innerFacetDiv.append('div')
        .attr('class', 'category-detail')
        .append('p');
      facetDivs.merge(facetDivs);
      mainFacetDiv.select('.underline')
        .text(function(d) {
          return d.key;
        });
      mainFacetDiv.select('.score')
        .transition()
        .on('start', function() {
          d3.active(this)
            .tween('text', function(d) {
              let format = d3.format(',d');
              var that = d3.select(this);
              var i = d3.interpolateNumber(that.text().replace(/,/g, ''), d.score);
              return function(t) {
                that.text(format(i(t)));
              }
            });
        });
      mainFacetDiv.select('.score-title')
        .text(function(d) {
          return getScoreTitle(d.score);
        });
      mainFacetDiv.select('.category-detail')
        .select('p')
        .text(function(d) {
          return d.text;
        });
    }
  });
}

function transitionNumber(text, score) {
  let format = d3.format(',d');
  text.transition()
    .on('start', function () {
      d3.active(this)
        .tween('text', function() {
          var that = d3.select(this);
          var i = d3.interpolateNumber(that.text().replace(/,/g, ''), score);
          return function(t) {
            that.text(format(i(t)));
          }
        });
    });
}

function pullOutDates(userName) {
  return names[userName].data.reports.map(report => {
    return report.date;
  });
}

function drawDateInputs(dates) {
  var div = d3.select('#radioDiv');
  var labels = div.selectAll('.date').data(dates, function(d) {
    return d;
  });
  labels.exit().remove();
  labels.enter()
    .append('label')
    .text(function(d) {
      return d;
    })
    .attr('class', 'date')
    .append('input')
    .attr('id', function(d) {
      return d;
    })
    .attr('type', 'radio')
    .attr('name', 'dates')
    .attr('value', function(d) {
      return d;
    })
    .on('change', function(d) {
      if (d3.select(this).property('checked')) {
        selectedDate = d;
        displayScores();
      }
    });
}

d3.select('#userSelect').on('change', function() {
  let value = d3.select(this).property('value');
  selectedUser = value;
  if (value !== '') {
    setup();
    displayScores();
  }
});

d3.select('#Extraversion').on('click', function () {
  removeUnderline();
  underline(extra);
  selectedCategory = 'Extraversion';
  displayScores();
});

d3.select('#Agreeableness').on('click', function () {
  removeUnderline();
  underline(agree);
  selectedCategory = 'Agreeableness';
  displayScores();
});

d3.select('#Conscientiousness').on('click', function () {
  removeUnderline();
  underline(consci);
  selectedCategory = 'Conscientiousness';
  displayScores();
});

d3.select('#Neuroticism').on('click', function () {
  removeUnderline();
  underline(neuro);
  selectedCategory = 'Neuroticism';
  displayScores();
});

d3.select('#Openness').on('click', function () {
  removeUnderline();
  underline(open);
  selectedCategory = 'Openness to Experience';
  displayScores();
});

function underline(element) {
  element.classed('underline', true);
}

function removeUnderline() {
  extra.classed('underline', false);
  agree.classed('underline', false);
  consci.classed('underline', false);
  neuro.classed('underline', false);
  open.classed('underline', false);
}

function getScoreTitle(score) {
  if (0 <= score && score < 30) {
    return 'Low';
  }
  else if (30 <= score && score < 60) {
    return 'Average';
  }
  else if (60 <= score && score < 100) {
    return 'High';
  }
  else {
    return '¯\\_(ツ)_/¯';
  }
}
