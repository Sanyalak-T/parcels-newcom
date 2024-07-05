/** @format */

pdfMake.fonts = {
    Roboto: {
      normal: 'Roboto-Regular.ttf',
      bold: 'Roboto-Medium.ttf',
      italics: 'Roboto-Italic.ttf',
      bolditalics: 'Roboto-MediumItalic.ttf',
    },
    THSarabunNew: {
      normal: 'THSarabunNew.ttf',
      bold: 'THSarabunNew-Bold.ttf',
      italics: 'THSarabunNew-Italic.ttf',
      bolditalics: 'THSarabunNew-BoldItalic.ttf',
    },
  };
  
  let parcelReport = document.getElementById('parcelreport');
  
  // get parceltype and parcelname
  const selectParcelType = document.getElementById('selectparceltype');
  const selectParcelName = document.getElementById('selectparcelname');
  let selectParcelTypeValue = selectParcelType.value;
  let selectParcelNameValue = selectParcelName.value;
  
  async function genPdf(event) {
    event.preventDefault();
  
    let parcelTypes = [];
    let resParcelType = await fetch('http://localhost:3000/parceltypes');
    let jsonParcelType = await resParcelType.json();
    parcelTypes = jsonParcelType;
  
    let parcelTypeArr = parcelTypes.filter((x) => x.parceltypename === 'ตู้ลอย');
  
    let resultParcelType = parcelTypeArr.map(({ parceltypename }) => {
      return parceltypename;
    });
  
    let parceltype = resultParcelType[0];
  
    let equipmentKindArr = parcelTypes.filter((y) => {
      if (y.equipmentkind === 'ครุภัณฑ์ สำนักงาน') {
        return true;
      }
    });
  
    let resultEquipmentKind = equipmentKindArr.map((ek) => {
      return ek.equipmentkind;
    });
  
    let equipmentkind = resultEquipmentKind[0];
  
    let organizations = [];
    let resOrganization = await fetch('http://localhost:3000/organizations');
    let jsonOrganization = await resOrganization.json();
    organizations = jsonOrganization;
  
    let resultOrgName = organizations.map(
      ({ organizationname }) => organizationname
    );
    let resultPartGovern = organizations.map(
      ({ partgovernment }) => partgovernment
    );
  
    let organization = resultOrgName[0];
    let partgovernment = resultPartGovern[0];
  
    //fix data for report
    const PARTGOVERNMENT = `สสอ.ชัยบุรี`;
    const EQUIPMENTTYPE = `คุรุภัณฑ์`;
    const MATERIALTYPE = `พัสดุ`;
    const NOTSPECIFIED = `-`;

    const partGovernMent = `${PARTGOVERNMENT}`;
    const organizationName = `${organization}`;
    const parcelTypeName = `${EQUIPMENTTYPE}`;
    const equipmentKind = `${NOTSPECIFIED}`;
    //
  
    // const partGovernMent = `สสอ.ชัยบุรี`;
    // const organizationName = `รพสต.ไทรทอง`;
    // const parcelTypeName = `ครุภัณฑ์สำนักงาน`;
    // const equipmentKind = `ตู้ลอย`;
  
    const tableHeader = [
      { text: 'วดป.ที่ได้รับ', alignment: 'center', bold: true },
      { text: 'เลขที่ หรือรหัส', alignment: 'center', bold: true },
      { text: 'ยี่ห้อ ชนิด แบบ ขนาดและลักษณะ.', alignment: 'center', bold: true },
      { text: 'ราคาต่อหน่วย (บาท)', alignment: 'center', bold: true },
      { text: 'วิธีการได้มา', alignment: 'center', bold: true },
      { text: 'ใช้ประจำที่', alignment: 'center', bold: true },
      { text: 'หมายเหตุ', alignment: 'center', bold: true },
    ];
  
    let parcels = [];
  
    let response = await fetch('http://localhost:3000/parcels');
    let jsonParcels = await response.json();
    parcels = jsonParcels;
  
    let bodyTable = [];
  
    bodyTable = parcels.map(
      ({
        arrivaldate,
        numberorcode,
        brandtypemodelsizedescrip,
        unitprice,
        howtoget,
        stationary,
        parcelremark,
      }) => {
        return [
          { text: dayjs(arrivaldate).format('DD-MM-YYYY') },
          { text: numberorcode },
          { text: brandtypemodelsizedescrip },
          { text: unitprice },
          { text: howtoget },
          { text: stationary },
          { text: parcelremark },
        ];
      }
    );
  
    bodyTable.unshift(tableHeader);
  
    pdfMake
      .createPdf({
        pageOrientation: 'landscape',
        pageSize: 'A4',
        pageMargins: 50,
        header: function (currentPage, pageCount, pageSize) {
          //ad logic
          return {
            columns: [
              {
                text: `page ${currentPage}/${pageCount}`,
                alignment: 'right',
                margin: [0, 10, 10, 0],
              },
            ],
          };
        },
        footer: function (currentPage, pageCount, pageSize) {
          //ad logic
          return {
            columns: [
              {
                text: new Date().toLocaleString(),
                alignment: 'left',
                margin: [10, 10, 0, 0],
              },
              {
                text: 'createb by Admin',
                alignment: 'right',
                margin: [0, 10, 10, 0],
              },
            ],
          };
        },
        content: [
          {
            text: 'รายงานทะเบียนครุภัฑ์',
            bold: true,
            fontSize: 28,
            alignment: 'center',
            margin: [0, 0, 0, 20],
          },
          {
            table: {
              widths: [178, 178, 178, 178],
              body: [
                [
                  `ส่วนราชาการ ${partGovernMent}`,
                  `หน่วยงาน ${organizationName}`,
                  `ประเภท ${parcelTypeName}`,
                  `ชื่อหรือชนิด ${equipmentKind}`,
                ],
              ],
            },
            margin: [0, 0, 0, 30],
            // bold: true,
          },
          {
            layout: 'Borders',
            table: {
              headerRows: 1,
              widths: [98, 98, 98, 98, 98, 98, 98],
              body: bodyTable,
            },
          },
        ],
        defaultStyle: {
          font: 'THSarabunNew',
          fontSize: 14,
        },
      })
      .open();
  }
  
  parcelReport.addEventListener('click', genPdf);