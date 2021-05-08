function obterDadosAPICep() {
    //variável "tbody" referenciando o corpo da tabela.
    const tbody = $('#table');

    //variável que salva o valor informado pelo usuário no campo CEP.
    const valorCep = document.getElementById('cep').value;

    //variável que concatena a API com o CEP informado pelo usuário.
    const link = "http://viacep.com.br/ws/" + valorCep + "/json/"

    //método que busca as informação diretamente da API e retorna para o HTML do site.
    $.ajax({
        url: link,
        type: 'GET',
        dataType: 'json',
        beforeSend: function() {
            $('#table').after('<p class="loading">Aguarde...</p>')
        },
        error: function() {
            $('#table').after('<p class="loading">Deu ruim no fusca!</p>')
        },
        success: function(dados) {
            console.log(dados);
            requisicaoIdClimaTempo(dados.localidade, dados.uf);
            //função que envia as informações retiradas da API para o HTML do site.
            mostrarDados(dados);
        },
        complete: function() {
            $('.loading').remove();
        }
    })

    function mostrarDados(dados) {
        //acrescentando as informações no corpo da tabela (tbody).
        tbody.append(`
           <tr>
               <td scope="row">${dados.cep}</td>
               <td>${dados.logradouro}</td>
               <td>${dados.bairro}</td>
               <td>${dados.localidade}</td>
               <td>${dados.uf}</td>
               <td>${dados.ibge}</td>
               <td>${dados.ddd}</td>
           </tr>`);
    }
}

//função que insere máscara no input de CEP.
function mascara(t, mask) {
    var i = t.value.length;
    var saida = mask.substring(1, 0);
    var texto = mask.substring(i)
    if (texto.substring(0, 1) != saida) {
        t.value += texto.substring(0, 1);
    }
}

//refazer códigos a partir daqui ----------------
function requisicaoIdClimaTempo(cidade, uf) {

    const link = "https://apiadvisor.climatempo.com.br/api/v1/locale/city?name=" + cidade + "&state=" + uf + "&token=c1cdba8979fd4fb41bf76d03b1d04eb9";

    $.ajax({
        url: link,
        type: 'GET',
        dataType: 'json',
        success(data) {
            let idCidade = data[0].id;
            previsaoDoTempo(idCidade);
            $(".cidadeEstado").text(cidade + ' ' + uf);

        },
    })
}

function previsaoDoTempo(id) {
    let link = "https://apiadvisor.climatempo.com.br/api/v1/weather/locale/" + id + "/current?token=c1cdba8979fd4fb41bf76d03b1d04eb9";
    $.get(link, atualizarCardTempo);
}

function atualizarCardTempo(data) {
    $(".temperaturaAtual").text(data.data.temperature + "º");
    $(".condicaoClimatica").text(data.data.condition);
    $(".umidadeValor").text(data.data.humidity + " %");
    $(".sensacaoValor").text(data.data.sensation + " º");
    $(".ventoValor").text(data.data.wind_velocity + " km/h");
    $(".cartaoPrevisao").fadeIn(200);
};