var SEARCH_GET_RESULT = {
  load: function () {
    $.ajax({
      url: "/json/data.json",
      type: 'GET',
      dataType: 'json',
      cache: false
    }).then(
      $.proxy(this.init, this),
      function () {
        console.log('error');
      }
    )
  },
  init: function (json) {
    this.json = json;
    this.setCassettes();
    this.setParameters();
    this.bindEvent();
  },
  setCassettes: function () {
    var $resultList = $('.jscResultList');
    var fragment = document.createDocumentFragment();
    var $temp = $resultList.children('li').detach();

    for (var i = 0; i < this.json.length; i++) {
      var $cassette = $temp.clone();
      $cassette.find('.jscResultTitle').text(this.json[i].title);
      $cassette.find('.jscResultBody').text(this.json[i].body);
      fragment.appendChild($cassette.get(0));
    }
    $resultList.get(0).appendChild(fragment);
  },
  setParameters: function () {
    this.$searchResultTitle = $('.jscResultTitle');
    this.$searchResultBody = $('.jscResultBody');
  },
  bindEvent: function () {
    $('.jscInput').on('input', $.proxy(this.search, this));
  },
  search: function (e) {
    var searchKeyword = $(e.target).val();
    if (searchKeyword.match(/[!"#$%&'()*,\-.\/:;<>?@\[\\\]\^_`{|}~]/)) {
      return;
    }
    $.each(this.json, $.proxy(function (index, item) {
      var $targetTitle = this.$searchResultTitle.eq(index);
      var $targetTitleText = $targetTitle.text();
      var $targetBody = this.$searchResultBody.eq(index);
      var $targetBodyText = $targetBody.text();

      if (searchKeyword.length == 0) { // 検索ワードが未入力の場合
        $targetTitle.get(0).innerHTML = $targetTitleText;
        $targetBody.get(0).innerHTML = $targetBodyText;
        return;
      }
      else {
        // title
        var matchResultTitle = $targetTitleText.match(new RegExp(searchKeyword, "gi"));
        if (matchResultTitle) { // マッチングした文字列があれば実行
          for (var i = 0; i < matchResultTitle.length; i++) {
            var newBody = $targetTitleText.replace(new RegExp(searchKeyword, "gi"), '<span class="heightLight">' + matchResultTitle[i] + '</span>');
            $targetTitle.html(newBody);
          }
        }
        else {
          $targetTitle.get(0).innerHTML = $targetTitleText;
          return;
        }
        // body
        var matchResultBody = $targetBodyText.match(new RegExp(searchKeyword, "gi"));
        if (matchResultBody) { // マッチングした文字列があれば実行
          for (var i = 0; i < matchResultBody.length; i++) {
            var newBody = this.$searchResultBody.eq(index).text().replace(new RegExp(searchKeyword, "gi"), '<span class="heightLight">' + matchResultBody[i] + '</span>');
            this.$searchResultBody.eq(index).html(newBody);
          }
        }
        else {
          $targetBody.get(0).innerHTML = $targetBodyText;
        }
      }
    }, this));
  }
};

$(function () {
  SEARCH_GET_RESULT.load();
});
