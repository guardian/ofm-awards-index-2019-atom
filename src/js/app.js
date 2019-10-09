// 🤞
import loadJson from '../components/load-json/'


// to do
// this sometimes fails:
// var pageId = parent.window.guardian.config.page.pageId;

function appStart() {
  renderSeriesTag();
  loadJson("https://interactive.guim.co.uk/docsdata-test/1t0Sapl3sHaxGOQw1g2FS1VI5iJAVQr37GSLCknIAAmI.json")
    .then((data) => {
      var awards = data.sheets[Object.keys(data.sheets)[0]];
      setTimeout(function () {
        renderPromo(awards);
        renderList(awards);
        setupInteraction();
        showAtom();
      }, 600);
    });
}

function renderSeriesTag() {
  var pDoc = parent.document;

  // try web
  var webSeriesLink = pDoc.querySelector('.content__series-label a');
  var webSeriesLabel = pDoc.querySelector('.content__series-label span');
  if (webSeriesLink && webSeriesLabel) {
    webSeriesLabel.innerText = 'Observer Food Monthly Awards 2018';
    webSeriesLink.setAttribute('href', '/observer-food-monthly-awards')
  }

  // try app
  var appSeriesEl = pDoc.querySelector('.article-kicker__series a');
  if (appSeriesEl) {
    appSeriesEl.innerText = 'Observer Food Monthly Awards 2018';
    appSeriesEl.setAttribute('href', 'x-gu://front/mobile.guardianapis.com/uk/fronts/observer-food-monthly-awards');
  }


}

function renderPromo(awards) {
  var award = findNext(awards);

  var el = document.querySelector('.ofm-next-up');

  // Set title
  var imgEl = el.querySelector('.ofm-next-up__image');
  imgEl.style.backgroundImage = 'url("' + award['Image'] + '")';

  // Set background image
  var nameEl = el.querySelector('.ofm-next-up__label__name .text');
  nameEl.innerText = award['Name'];

  // set attributes that depend on whether it's live or not
  if (award['Status'] == 'Live') {
    var typeEl = document.querySelector('.ofm-next-up__label__type');
    typeEl.innerText = 'Continue browsing';
    var iconEl = el.querySelector('.ofm-next-up__label__name .icon');
    iconEl.innerHTML = "&nbsp;<span class='icon__obj'><svg width='15' height='14' viewBox='0 0 15 14' xmlns='http://www.w3.org/2000/svg'><path d='M.4 7.57h11.475l-4.5 5.385.585.585 6.255-6.27v-.6L7.96.4l-.585.585 4.5 5.385H.4z' fill='#121212' fill-rule='evenodd'/></svg></span>";

    var linkEl = document.createElement('a');
    linkEl.classList.add('ofm-next-up__link');
    linkEl.setAttribute('href', platformIndependentLink(award));
    linkEl.setAttribute('target', '_top');
    el.insertBefore(linkEl, el.firstChild);

  } else {
    var typeEl = document.querySelector('.ofm-next-up__label__type');
    typeEl.innerText = 'Out tomorrow';
  }

}

function findNext(awards) {
  var pageId = parent.window.guardian.config.page.pageId;
  var currentAward = false;
  var nextAward = awards[0];

  for (var i = 0; awards.length > i; i++) {
    var a = awards[i];
    if (a['Main link'].indexOf(pageId) > -1 || a['Runner-up link'].indexOf(pageId) > -1) {
      currentAward = i;
    }
  }

  if (currentAward !== false && currentAward + 1 != awards.length) {
    nextAward = awards[currentAward + 1];
  }

  return nextAward;
}

function platformIndependentLink(award) {
  var pBody = parent.document.body;
  var linkPrefix;

  if (pBody.classList.contains('ios') || pBody.classList.contains('android')) {
    // linkPrefix = 'x-gu://item/mobile-preview.guardianapis.com/items';
    linkPrefix = 'x-gu://item/mobile.guardianapis.com/items';
  } else {
    // linkPrefix = 'https://preview.gutools.co.uk'
    linkPrefix = 'https://www.theguardian.com';
  }

  if (award['Main link'].indexOf('/') != 0) {
    linkPrefix += '/';
  }

  return linkPrefix + award['Main link'];
}

function renderList(awards) {
  var linksWrapper = document.querySelector('.ofm-index__all__links');

  for (var i = 0; awards.length > i; i++) {
    var award = awards[i];
    if (award['Status'] == 'Live') {

      var awardEl = document.createElement('a');
      awardEl.classList.add('active');
      awardEl.innerHTML = "<span class='text'>" + award['Name'] + "</span><span class='icon'><span class='icon__obj'><svg width='11' height='10' viewBox='0 0 11 10' xmlns='http://www.w3.org/2000/svg'><path d='M.4 5.44h8.067L5.304 9.227l.41.412 4.398-4.408v-.422L5.715.4l-.411.411 3.163 3.786H.4z' fill='#FFF' fill-rule='evenodd'/></svg></span></span>";
      awardEl.setAttribute('href', platformIndependentLink(award));
      awardEl.setAttribute('target', '_top');

    } else {

      var awardEl = document.createElement('span');
      awardEl.classList.add('inactive');
      awardEl.innerText = award['Name'];

    }
    awardEl.classList.add('listing');
    linksWrapper.appendChild(awardEl);
  }
}

function showAtom() {
  document.body.classList.add('render');

  var atomParentStyles = document.createElement('style');
  atomParentStyles.innerHTML = '@media (max-width: 30em) { .gs-container .element-atom.element--supporting { margin-left: -10px; } .from-content-api .element-atom.element--supporting { margin-left: -12px; } } .element-atom.element--supporting iframe { width: 100%; }';
  parent.document.body.appendChild(atomParentStyles);

  window.resize();
}

function setupInteraction() {
  document.querySelector('.ofm-index__expand__label').addEventListener('click', function () {
    document.querySelector('.interactive-wrapper').classList.add('full-index');

    window.resize();

  })
}

appStart();


