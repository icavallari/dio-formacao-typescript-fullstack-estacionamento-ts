(function () {
    var _a;
    const $ = (query) => document.querySelector(query);
    function calcTempo(mil) {
        const min = Math.floor(mil / 60000);
        const sec = Math.floor((mil % 60000) / 1000);
        return `${min}m e ${sec}s`;
    }
    function patio() {
        function ler() {
            return localStorage.patio ? JSON.parse(localStorage.patio) : [];
        }
        function salvar(carros) {
            localStorage.setItem('patio', JSON.stringify(carros));
        }
        function adicionar(carro, _salvar) {
            var _a, _b;
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${carro.nome}</td>
                <td>${carro.placa}</td>
                <td>${carro.entrada}</td>
                <td>
                    <button class="delete" data-placa="${carro.placa}">x</button>
                </td>
            `;
            (_a = row.querySelector(".delete")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function () {
                remover(this.dataset.placa);
            });
            (_b = $('#patio')) === null || _b === void 0 ? void 0 : _b.appendChild(row);
            if (_salvar) {
                salvar([...ler(), carro]);
            }
        }
        function remover(placa) {
            const { nome, entrada } = ler().find(veiculo => veiculo.placa === placa);
            const tempo = calcTempo(new Date().getTime() - new Date(entrada).getTime());
            if (!confirm(`O veiculo ${nome} ficou por ${tempo}. Deseja encerrar?`)) {
                return;
            }
            salvar(ler().filter(veiculo => veiculo.placa !== placa));
            render();
        }
        function render() {
            $('#patio').innerHTML = '';
            const patio = ler();
            if (patio.length) {
                patio.forEach(veiculo => adicionar(veiculo));
            }
        }
        return { ler, adicionar, remover, salvar, render };
    }
    patio().render();
    (_a = $('#cadastrar')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
        var _a, _b;
        const nome = (_a = $('#nome')) === null || _a === void 0 ? void 0 : _a.value;
        const placa = (_b = $('#placa')) === null || _b === void 0 ? void 0 : _b.value;
        if (!nome || !placa) {
            alert('Os campos nome e placa são obrigatórios');
            return;
        }
        patio().adicionar({ nome, placa, entrada: new Date() }, true);
    });
})();
