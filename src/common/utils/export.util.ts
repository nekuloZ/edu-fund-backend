import * as ExcelJS from 'exceljs';
import { Response } from 'express';

export class ExportUtil {
  /**
   * 导出Excel文件
   * @param data 数据数组
   * @param headers 表头配置
   * @param filename 文件名
   * @param res Response对象
   */
  static async exportExcel(
    data: any[],
    headers: { key: string; header: string }[],
    filename: string,
    res: Response,
  ) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');

    // 设置表头
    worksheet.columns = headers;

    // 添加数据
    data.forEach((item) => {
      worksheet.addRow(item);
    });

    // 设置响应头
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=${encodeURIComponent(filename)}.xlsx`,
    );

    // 写入响应流
    await workbook.xlsx.write(res);
    res.end();
  }

  /**
   * 导出CSV文件
   * @param data 数据数组
   * @param headers 表头配置
   * @param filename 文件名
   * @param res Response对象
   */
  static async exportCSV(
    data: any[],
    headers: { key: string; header: string }[],
    filename: string,
    res: Response,
  ) {
    // 设置响应头
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=${encodeURIComponent(filename)}.csv`,
    );

    // 写入表头
    const headerRow = headers.map((h) => h.header).join(',');
    res.write(headerRow + '\n');

    // 写入数据
    data.forEach((item) => {
      const row = headers.map((h) => item[h.key]).join(',');
      res.write(row + '\n');
    });

    res.end();
  }
}
