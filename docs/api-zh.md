# 睡眠呼吸监测报告系统 API 文档

## 概述
本文档描述了睡眠呼吸监测报告系统的 API 接口。

---

## 目录
1. [患者信息接口](#患者信息接口)
2. [文件上传接口](#文件上传接口)
3. [睡眠报告接口](#睡眠报告接口)

---

## 患者信息接口

### GET /api/patients/:id
根据 ID 获取患者信息。

**响应：**
```json
{
  "id": "string",
  "name": "string",
  "gender": "male | female",
  "age": "number",
  "department": "string",
  "bedNumber": "string",
  "occupation": "string"
}
```

---

## 文件上传接口

### POST /api/upload
上传文件到 OSS（阿里云对象存储服务）。这是一个服务端 API，用于安全处理文件上传，不会将凭证暴露给客户端。

**请求：** `multipart/form-data`

| 字段 | 标签         | 类型 |
| ---- | ------------ | ---- |
| file | 要上传的文件 | file |

**限制说明：** 此 API 路由不再在应用层限制文件大小或文件数量。
实际可上传上限仍可能受部署基础设施或底层存储服务限制。


**响应（成功）：**
```json
{
  "url": "https://your-bucket.oss-region.aliyuncs.com/sleep-reports/1234567890-abc123.edf",
  "key": "sleep-reports/1234567890-abc123.edf"
}
```

**响应（错误）：**
```json
{
  "error": "上传失败",
  "details": ["错误信息"]
}
```

**注意：** 此 API 使用服务端环境变量中存储的凭证（不会暴露给客户端）。文件上传到阿里云 OSS，并返回预签名 URL 用于后续 API 调用。

---

## 睡眠报告接口

### POST /api/reports
创建新的睡眠报告（分析 EDF 文件并生成报告）。

**请求：** `multipart/form-data`

| 字段                 | 标签              | 类型                           |
| -------------------- | ----------------- | ------------------------------ |
| patientInfo          | 患者信息(JSON)    | string                         |
| chiefComplaint       | 主诉              | string                         |
| presentIllness       | 现病史            | string                         |
| originalSequenceFile | 原始序列文件(EDF) | string (OSS URL)               |
| diagnosticReport     | 诊断报告(PDF)     | string (OSS URL，可选)         |
| scalesUrls           | 量表文件(Word)    | string[] (OSS URL，可选，多个) |

**patientInfo 字段：**

| 字段       | 标签   | 类型          |
| ---------- | ------ | ------------- |
| id         | 患者ID | string (可选) |
| name       | 姓名   | string        |
| gender     | 性别   | string        |
| age        | 年龄   | number        |
| department | 科室   | string        |
| bedNumber  | 床号   | string        |
| occupation | 职业   | string        |

---

### GET /api/reports/:id
根据 ID 获取睡眠报告。

**响应：**
```json
{
  "diagnosis": "string",
  "diagnosisBasis": {
    "detailEvidence": "string",
    "basis": "string"
  },
  "possibleCauses": "string",
  "sleepPrescription": "string",
  "scalesData": {
    "cognitivePrediction": {
      "MOCA": "number",
      "MMSE": "number"
    },
    "emotionPrediction": {
      "HAMA": "number",
      "HAMD": "number"
    }
  },
  "prediction": {
    "actualAge": "number",
    "physiologicalAgePrediction": "number"
  },
  "referenceGuidelines": [
    {
      "name": "string",
      "description": "string"
    }
  ],
  "sleepStageDistributionChart": "string (optional, base64 or URL)",
  "sleepTotalDurationHour": "number",
  "sleepEfficiency": "number",
  "createdAt": "timestamp"
}
```

说明：`scalesData` 整体字段也可能缺失或为 `null`（可选）。
说明：`sleepStageDistributionChart`、`sleepTotalDurationHour`、`sleepEfficiency` 也可能缺失或为 `null`（可选）。

**响应字段：**

| 字段                          | 标签              | 类型                    |
| ----------------------------- | ----------------- | ----------------------- |
| diagnosis                     | 诊断              | string                  |
| diagnosisBasis.detailEvidence | 诊断依据-详细证据 | string                  |
| diagnosisBasis.basis          | 诊断依据-依据     | string                  |
| possibleCauses                | 可能病因          | string                  |
| sleepPrescription             | 睡眠处方          | string                  |
| scalesData                    | 量表数据          | object (可选，可为null) |
| prediction                    | 年龄预测          | object                  |
| referenceGuidelines           | 引用指南          | array                   |
| sleepStageDistributionChart   | 睡眠分期分布图    | string (可选，可为null) |
| createdAt                     | 创建时间          | string                  |
| sleepTotalDurationHour        | 睡眠总时长(小时)  | float (可选，可为null)  |
| sleepEfficiency               | 睡眠效率          | float (可选，可为null)  |

**scalesData 字段（存在时）：**

| 字段                | 标签         | 类型 |
| ------------------- | ------------ | ---- |
| cognitivePrediction | 认知功能预测 | json |
| emotionPrediction   | 情绪分析预测 | json |

**cognitivePrediction 字段：**

| 字段 | 标签           | 类型   |
| ---- | -------------- | ------ |
| MOCA | MoCA量表预测值 | number |
| MMSE | MMSE量表预测值 | number |

**emotionPrediction 字段：**

| 字段 | 标签           | 类型   |
| ---- | -------------- | ------ |
| HAMA | HAMA量表预测值 | number |
| HAMD | HAMD量表预测值 | number |

**prediction 字段：**

| 字段                       | 标签         | 类型                    |
| -------------------------- | ------------ | ----------------------- |
| actualAge                  | 实际年龄     | number                  |
| physiologicalAgePrediction | 生理年龄预测 | number (可选，可为null) |

**referenceGuidelines 字段：**

| 字段        | 标签     | 类型   |
| ----------- | -------- | ------ |
| name        | 指南名称 | string |
| description | 指南描述 | string |

---

## 错误响应

### 400 请求错误
```json
{
  "error": "验证错误信息"
}
```

### 404 未找到
```json
{
  "error": "资源未找到"
}
```

### 500 服务器内部错误
```json
{
  "error": "服务器内部错误"
}
```
