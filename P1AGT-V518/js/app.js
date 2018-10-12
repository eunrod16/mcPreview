var app = new Vue({
  el: '#app',
  data: function() {
    return {
      cajita: {},
      ensalada:{},
      carta:{}
    }
  },
  created() {
    var self = this;
    this.getProducts(function(cajita,ensalada,carta){
      self.cajita = cajita;
      self.ensalada = ensalada;
      self.carta= carta;
    });
  },
  methods: {
    getProducts (callback) {

      SB.setup({
        url: 'http://gt.mcd.switchboardcms.com',
        success: init
      })


      function init() {
        SB.Data.load({
          url:'https://gt.mcd.switchboardcms.com',
          sources: [
            { name:'products', filename:'P1AGT-V518.csv' },
            { name:'prices', filename:'product-db1.csv' },
          ],
          success: function () {
            var ensalada = {};
            var productosCarta = [];
            var productosCajita = [];
            var bodegonCarta, bebidaCajita, postreCajita, jugueteCajita = "";
            if (window.location.origin=="file://"){
              var location_rest ="GT43";
              var rutaImagen = "https://gt.mcd.switchboardcms.com/file/";
            }
            else {
              location_rest = Switchboard.environmentData.location;
              var rutaImagen = "/file/";
            }
            var productos = SB.Dataset(SB.Data.get("products"))
            .join(SB.Data.get("prices")).on('Codigo De Producto')
            .get();
	    console.log(productos,location_rest,rutaImagen);
            productos = SB.Dataset(productos).where('Codigo De Localizacion', '=', location_rest)
            productos = SB.Dataset(productos).where('Active', '=', 1)
            productos.forEach(function(e){
              var eimagen = rutaImagen+e.Imagen;
              var producto={
                nombre: e.Nombre,
                precio: (e['Precio Reemplazo'])?e['Precio Reemplazo']:e['Precio Nivel1'],
                imagen: eimagen
              }
              switch(e.Categoria) {
                case "Ensalada":
                ensalada = {
                  imagen:eimagen,
                  precio:(e['Precio Reemplazo'])?e['Precio Reemplazo']:e['Precio Nivel1']
                };
                break;
                case "Bodegón Carta":
                bodegonCarta = eimagen;
                break;
                case "Carta":
                productosCarta.push(producto);
                break;
                case "Cajita":
                productosCajita.push(producto);
                break;
                case "Bebida":
                bebidaCajita = eimagen;
                break;
                case "Postre":
                postreCajita = eimagen;
                break;
                case "Juguete":
                jugueteCajita = eimagen;
                break;
                default:

              }

            });
            var carta = {
              productos: productosCarta,
              bodegon:  bodegonCarta,
            };
            var cajita = {
              productos: productosCajita,
              bebida: bebidaCajita,
              postre: postreCajita,
              juguete: jugueteCajita
            };
            return callback(cajita,ensalada,carta);
          }
        });

      }
    }
  },
  computed: {
    sinEnsalada: function () {
      return jQuery.isEmptyObject(this.ensalada)
    }
  }
});
