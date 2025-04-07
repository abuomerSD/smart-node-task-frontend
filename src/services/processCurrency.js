export default {
  install(Vue) {
    let self = Vue.config.globalProperties
    Vue.config.globalProperties.processCurrency = (currency,value,dontShowSymbol)=> {
      console.log("currency",currency)
      if(!currency) return 0
      return  (currency.symbol_position=='after'? '' : currency?.symbol
              ? currency?.symbol
              : currency?.short_name )+" "+
          parseFloat(value).toLocaleString() + " " +
          (currency.symbol_position=='before'? '' : currency?.symbol
              ? currency?.symbol
              : currency?.short_name ) +
          ( !currency.is_functional && !dontShowSymbol ?
          (
              (self.$i18n.locale=='en' ? ' (Rate: ':' (معدل الصرف: ')+currency.current_rate+")"):
          "")
    };
  },
};
