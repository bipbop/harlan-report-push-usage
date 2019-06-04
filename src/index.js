import $ from 'jquery';
import harlan from 'harlan';
import Chart from 'chart.js';
import map from 'lodash/map';

import { Harmonizer } from 'color-harmony';

const harmonizer = new Harmonizer();

harlan.addPlugin((controller) => {
  function drawReport(data) {
    const report = controller.call('report',
      'Crescimento de PUSHs',
      'Visualize o crescimento dos PUSHs na base de dados.',
      'Com este relatório é possível visualizar quais cliente estão adicionando mais processos a base. Os PUSHs monitorados são aqueles que ainda não foram deletados e não possuem restrição quanto a sua versão. O objetivo é nortear o comercial sobre quais clientes devems ser trabalhados');

    const colors = harmonizer.harmonize('#00ff6b', [0, 10, 20, 30, 40, 50, 60, 70, 80, 90]);
    const chartCanvas = report.canvas(800, 250);
    const chart = new Chart(chartCanvas.getContext('2d'), {
      type: 'bar',
      options: {
        responsive: false,
      },
      data: {
        labels: map(data, ({ username }) => username),
        datasets: [{
          label: 'Crescimento de PUSH',
          data: map(data, ({ total }) => total),
          backgroundColor: map(data, () => colors.shift()),
        }],
      },
    });
    report.gamification('brilliantIdea');

    const reportElement = report.element();
    $('.app-content').append(reportElement);
    return chart;
  }

  controller.registerTrigger('call::authentication::loggedin', '', (args, callback) => {
    callback();
    controller.server.call("SELECT FROM 'BIPBOPCOMPANYSREPORT'.'PUSHUSAGE'", {
      dataType: 'json',
      success: data => drawReport(data),
    });
  });
});
