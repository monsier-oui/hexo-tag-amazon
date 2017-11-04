'use strict';

var OperationHelper = require('apac').OperationHelper;

function isDev(){
  if(process.argv.length > 2 && (process.argv[2].match(/^d/) || process.argv[2].match(/^g/))){
    // console.log("hexo-env: production");
    return false;
  }else{
    // console.log("hexo-env: development");
    return true;
  }
}

hexo.extend.tag.register('amzn', function(args){
  if(!args) return;
  if(!hexo.config.amazon_plugin) return;
  if(!hexo.config.amazon_plugin.generateAlways && isDev()) return;

  var asin = args[0];
  var id = hexo.config.amazon_plugin.id;
  if(!id) id = '87oui-22';
  var locale = hexo.config.amazon_plugin.locale;
  if(!locale) locale = 'US';

  var opHelper = new OperationHelper({
    awsId: hexo.config.amazon_plugin.accessKey,
    awsSecret: hexo.config.amazon_plugin.accessKeySecret,
    assocId: id,
    locale: locale
  });
  return opHelper.execute('ItemLookup', {
    'ItemId': asin,
    'ResponseGroup': 'ItemAttributes,Images'
  }).then(function(res){
    var code = '';
    var result = res.result.ItemLookupResponse;
    if(result){
      var item = result.Items.Item;
      var url = item.DetailPageURL;
      var thumb = item.MediumImage.URL;

      var attr = item.ItemAttributes;
      var author = '';
      switch (attr.ProductGroup){
        case 'Book':
          author = attr.Author;
          break;
        case 'DVD':
          author = attr.Manufacturer;
          break;
        case 'Music':
          author = attr.Artist;
          break;
        default:
          author = attr.Brand;
          break;
      }
      if(author.isArray){
        author = author.join(', ');
      }
      var title = attr.Title;
      var price = '';
      if(attr.ListPrice) price = attr.ListPrice.FormattedPrice;
      var releaseDate = '';
      if(attr.ReleaseDate) releaseDate = attr.ReleaseDate;

      var wishlist = item.ItemLinks.ItemLink[0];

      code = '<figure class="hexo-tag-amazon">'
      +'<a href="'+url+'" class="hexo-tag-amazon-thumb"><img src="'+thumb+'"></a>'
      +'<figcaption class="hexo-tag-amazon-caption">'
      +'<a href="'+url+'" class="hexo-tag-amazon-title">'+title+'</a>'
      +'<div class="hexo-tag-amazon-meta">';
      if(author) code += '<span class="hexo-tag-amazon-author">'+author+'</span>';
      if(releaseDate) code += '<span class="hexo-tag-amazon-releaseDate">'+releaseDate+'</span>';
      if(price) code += '<span class="hexo-tag-amazon-price">'+price+'</span>';
      code += '</div>'
      +'<a href="'+url+'" class="hexo-tag-amazon-link">Buy</a>'
      +'</figcaption>'
      +'</figure>';
    }else{
      console.log(res.result.ItemLookupErrorResponse.Error.Message);
    }

    return code;
  }).catch(function(err){
    console.log('Something went wrong! ', err);
  });
},{
  async: true
});
