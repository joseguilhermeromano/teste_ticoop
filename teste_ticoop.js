const { Table } = require('console-table-printer');

class Student {
  constructor(
    id,
    name,
    cpf,
    address_id,
    education_id,
    is_brazilian,
    matriculation_dt
  ) {
    this.id = id;
    this.name = name;
    this.cpf = cpf;
    this.address_id = address_id;
    this.education_id = education_id;
    this.is_brazilian = is_brazilian;
    this.matriculation_dt = new Date(matriculation_dt);
  }
}

class Address {
  constructor(
    id,
    street,
    cep,
    number,
    district,
    city,
    state,
    country,
    complement
  ) {
    this.id = id;
    this.street = street;
    this.cep = cep;
    this.number = number;
    this.district = district;
    this.city = city;
    this.state = state;
    this.country = country;
    this.complement = complement;
  }
}

class Education {
  constructor(id, level, description) {
    this.id = id;
    this.level = level;
    this.description = description;
  }
}

class Material {
  constructor(id, name, weight, price, measures, group) {
    this.id = id;
    this.name = name;
    this.weight = weight;
    this.price = price;
    this.measures = measures;
    this.group = group;
  }
}

class Sale {
  constructor(
    id,
    matriculation_dt,
    school_id,
    student_id,
    type_sale,
    sale_dt,
    due_date,
    is_cash_payment,
    state
  ) {
    this.id = id;
    this.matriculation_dt = new Date(matriculation_dt);
    this.school_id = school_id;
    this.student_id = student_id;
    this.type_sale = type_sale;
    this.sale_dt = new Date(sale_dt);
    this.due_date = new Date(due_date);
    this.is_cash_payment = is_cash_payment;
    this.state = state;
  }
}

class Freight {
  constructor(id, state, value) {
    this.id = id;
    this.state = state;
    this.value = value;
  }
}

class ForeignStudent {
  constructor(
    id,
    nationality,
    passport_nr,
    passport_expiration_dt,
    passport_insurance_dt,
    student_id
  ) {
    this.id = id;
    this.nationality = nationality;
    this.passport_nr = passport_nr;
    this.passport_expiration_dt = new Date(passport_expiration_dt);
    this.passport_insurance_dt = new Date(passport_insurance_dt);
    this.student_id = student_id;
  }
}

class ItemSale {
  constructor(id, material_id, quantity, sale_id) {
    this.id = id;
    this.material_id = material_id;
    this.quantity = quantity;
    this.sale_id = sale_id;
  }
}

function formatarData(data) {
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0'); // Janeiro é 0!
  const ano = data.getFullYear();
  return `${dia}/${mes}/${ano}`;
}

function calcularDesconto(matriculation_dt, valor_total) {
  const anos_frequencia = Math.floor(
    diferencaDias(matriculation_dt, new Date()) / 365
  );
  let desconto_frequencia = 0;
  if (anos_frequencia <= 5) {
    desconto_frequencia = anos_frequencia * 0.1;
  } else {
    desconto_frequencia = 0.5;
  }

  return valor_total * (1 - desconto_frequencia);
}

function calcularJuros(sale, valor_total) {
  const dias = diferencaDias(sale.sale_dt, sale.due_date);
  const juros = dias * 0.0001;
  return valor_total * (1 + juros);
}

function calcularFrete(sale, fretes) {
  const frete = fretes.find((f) => f.state === sale.state);
  return frete ? frete.value : 0;
}

function diferencaDias(data_inicio, data_fim) {
  const umDia = 24 * 60 * 60 * 1000; // milissegundos em um dia
  const diferenca = Math.abs(data_fim - data_inicio);
  return Math.ceil(diferenca / umDia);
}

function principal() {
  // Inicialização de dados
  const addresses = [
    new Address(
      1,
      'Rua A',
      '12345678',
      123,
      'Bairro A',
      'Cidade A',
      'SP',
      'BR',
      'Apto 1'
    ),
    new Address(
      2,
      'Rua B',
      '87654321',
      456,
      'Bairro B',
      'Cidade B',
      'RJ',
      'BR',
      'Casa'
    ),
    new Address(
      3,
      'Avenida C',
      '11223344',
      789,
      'Bairro C',
      'Cidade C',
      'MG',
      'BR',
      'Bloco 3'
    ),
    new Address(
      4,
      'Rua D',
      '55667788',
      321,
      'Bairro D',
      'Cidade D',
      'RS',
      'BR',
      'Apto 405'
    ),
  ];

  const educations = [
    new Education(1, 'Ensino Médio', 'Ensino Médio Completo'),
    new Education(2, 'Ensino Fundamental', 'Ensino Fundamental Completo'),
  ];

  const students = [
    new Student(1, 'João', '12345678901', 1, 1, true, '2020-01-01'),
    new Student(2, 'Maria', null, 2, 2, false, '2021-01-01'),
  ];

  const materials = [
    new Material(1, 'Livro de Inglês', 0.5, 100.0, '20x15', 'impresso'),
    new Material(2, 'Apostila de Espanhol', 0.3, 80.0, '25x20', 'digital'),
  ];

  const fretes = [new Freight(1, 'SP', 10.0), new Freight(2, 'RJ', 15.0)];

  const sale = new Sale(
    1,
    '2020-01-01',
    1,
    1,
    'online',
    '2023-07-01',
    '2023-07-31',
    true,
    'SP'
  );

  const itemSale = new ItemSale(1, 1, 2, 1);

  const foreignStudents = [
    new ForeignStudent(
      1,
      'Americana',
      'A1234567',
      '2025-07-01',
      '2020-07-01',
      2
    ),
  ];

  // Calculando valor total da venda
  const material = materials.find((m) => m.id === itemSale.material_id);
  const student = students.find((s) => s.id === sale.student_id);
  let valor_material = itemSale.quantity * material.price;
  let valor_com_desconto = calcularDesconto(
    student.matriculation_dt,
    valor_material
  );

  if (!sale.is_cash_payment) {
    valor_com_desconto = calcularJuros(sale, valor_com_desconto);
  }

  const valor_frete = calcularFrete(sale, fretes);
  const valor_total_venda = valor_com_desconto + valor_frete;

  console.log('Addresses:');
  const addressesTable = new Table();
  addresses.forEach((address) => {
    addressesTable.addRow(address, { color: 'green' });
  });
  addressesTable.printTable();

  console.log('Students:');
  const studentsTable = new Table();
  students.forEach((student) => {
    studentsTable.addRow(
      {
        ...student,
        matriculation_dt: formatarData(student.matriculation_dt),
      },
      { color: 'blue' }
    );
  });
  studentsTable.printTable();

  console.log('Educations:');
  const educationsTable = new Table();
  educations.forEach((education) => {
    educationsTable.addRow(education, { color: 'purple' });
  });
  educationsTable.printTable();

  console.log('Materials:');
  const materialsTable = new Table();
  materials.forEach((material) => {
    materialsTable.addRow(material, { color: 'yellow' });
  });
  materialsTable.printTable();

  console.log('Sales:');
  const salesTable = new Table();
  salesTable.addRow(
    {
      ...sale,
      matriculation_dt: formatarData(sale.matriculation_dt),
      sale_dt: formatarData(sale.sale_dt),
      due_date: formatarData(sale.due_date),
    },
    { color: 'magenta' }
  );
  salesTable.printTable();

  console.log('Item Sales:');
  const itemSalesTable = new Table();
  itemSalesTable.addRow(itemSale, { color: 'cyan' });
  itemSalesTable.printTable();

  console.log('Freights:');
  const freightsTable = new Table();
  fretes.forEach((frete) => {
    freightsTable.addRow(frete, { color: 'red' });
  });
  freightsTable.printTable();

  console.log('Foreign Students:');
  const foreignStudentsTable = new Table();
  foreignStudents.forEach((foreignStudent) => {
    foreignStudentsTable.addRow(
      {
        ...foreignStudent,
        passport_expiration_dt: formatarData(
          foreignStudent.passport_expiration_dt
        ),
        passport_insurance_dt: formatarData(
          foreignStudent.passport_insurance_dt
        ),
      },
      { color: 'blue' }
    );
  });
  foreignStudentsTable.printTable();

  console.log('Valor total da venda: R$', valor_total_venda.toFixed(2));

  // Sequência de passos
  console.log(
    '\n### Sequência de Passos para Calcular o Valor Total da Venda ###'
  );
  console.log('1. Identificar o material da venda:');
  console.log('   Material:', material.name);
  console.log('   Preço por unidade: R$', material.price.toFixed(2));
  console.log('   Quantidade:', itemSale.quantity);
  console.log('   Valor do material:', valor_material.toFixed(2));

  console.log('\n2. Calcular o desconto:');
  const anos_frequencia = Math.floor(
    diferencaDias(student.matriculation_dt, new Date()) / 365
  );
  const desconto_frequencia =
    anos_frequencia <= 5 ? anos_frequencia * 0.1 : 0.5;
  console.log('   Anos de frequência:', anos_frequencia);
  console.log(
    '   Desconto de frequência:',
    (desconto_frequencia * 100).toFixed(2) + '%'
  );
  console.log('   Valor após desconto:', valor_com_desconto.toFixed(2));

  if (!sale.is_cash_payment) {
    const dias_atraso = diferencaDias(sale.sale_dt, sale.due_date);
    const juros = dias_atraso * 0.0001;
    console.log('\n3. Calcular os juros:');
    console.log('   Dias de atraso:', dias_atraso);
    console.log('   Juros aplicados:', (juros * 100).toFixed(2) + '%');
    valor_com_desconto = calcularJuros(sale, valor_com_desconto);
    console.log('   Valor após juros:', valor_com_desconto.toFixed(2));
  }

  console.log('\n4. Calcular o frete:');
  console.log('   Estado de destino:', sale.state);
  console.log('   Valor do frete:', valor_frete.toFixed(2));

  console.log('\n5. Calcular o valor total da venda:');
  console.log('   Valor final:', valor_total_venda.toFixed(2));
}

// Executa a função principal
principal();
