# hexo-tag-amazon
Plugin to generate a link to Amazon for HEXO. This depends on [apac](https://www.npmjs.com/package/apac).

## Install
```
npm install hexo-tag-amazon --saved
```

## Usage
```
{%amzn ISBN %}
{%amzn ASIN %}
```

First, you should edit your `_config.yml` by adding following configuration.

```yml
amazon_plugin:
  id: hogehoge-22 # Your Amazon associate ID
  locale: US
  accessKey: xxxxxxx # Your Amazon Product Advertising API Access key ID
  accessKeySecret: xxxxxxxxxxxxxxx # Your Amazon Product Advertising API Secret access key
  generateAlways: true # false -> Generate tag in "hexo generate"
```

### locale
See [here](https://www.npmjs.com/package/apac#locales).

## license
MIT