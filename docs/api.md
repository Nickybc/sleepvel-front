# Sleep Monitoring Report API Documentation

## Overview
This document describes the APIs for the Sleep Breathing Monitoring Report system.

---

## Table of Contents
1. [Patient Information APIs](#patient-information-apis)
2. [File Upload APIs](#file-upload-apis)
3. [Sleep Report APIs](#sleep-report-apis)

---

## Patient Information APIs

### GET /api/patients/:id
Fetch patient information by ID.

**Response:**
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

## File Upload APIs

### POST /api/upload
Upload a file to OSS (Aliyun Object Storage Service). This is a server-side API that handles file uploads securely without exposing credentials to the client.

**Request:** `multipart/form-data`

| field | label          | type |
| ----- | -------------- | ---- |
| file  | File to upload | file |

**Limits:** No application-level file size or file count limit is enforced by this API route.
Actual limits may still be imposed by deployment infrastructure or the underlying storage provider.


**Response (Success):**
```json
{
  "url": "https://your-bucket.oss-region.aliyuncs.com/sleep-reports/1234567890-abc123.edf",
  "key": "sleep-reports/1234567890-abc123.edf"
}
```

**Response (Error):**
```json
{
  "error": "Upload failed",
  "details": ["Error message"]
}
```

**Note:** This API uses server-side credentials stored in environment variables (not exposed to the client). The files are uploaded to Aliyun OSS and a presigned URL is returned for use in subsequent API calls.

---

## Sleep Report APIs

### POST /api/reports
Create a new sleep report (analyze EDF file and generate report).

**Request:** `multipart/form-data`

| field                | label             | type                                   |
| -------------------- | ----------------- | -------------------------------------- |
| patientInfo          | 患者信息(JSON)    | string                                 |
| chiefComplaint       | 主诉              | string                                 |
| presentIllness       | 现病史            | string                                 |
| originalSequenceFile | 原始序列文件(EDF) | string (OSS URL)                       |
| diagnosticReport     | 诊断报告(PDF)     | string (OSS URL, optional)             |
| scalesUrls           | 量表文件(Word)    | string[] (OSS URL, optional, multiple) |

**patientInfo fields:**

| field      | label      | type              |
| ---------- | ---------- | ----------------- |
| id         | PatientID  | string (optional) |
| name       | Name       | string            |
| gender     | Gender     | string            |
| age        | Age        | number            |
| department | Department | string            |
| bedNumber  | Bed Number | string            |
| occupation | Occupation | string            |

---

### GET /api/reports/:id
Fetch a sleep report by ID.

**Response:**
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

Note: the entire `scalesData` field may also be omitted or `null` (optional).
Note: `sleepStageDistributionChart`, `sleepTotalDurationHour`, and `sleepEfficiency` may also be omitted or `null` (optional).

**Response Fields:**

| field                         | label             | type                        |
| ----------------------------- | ----------------- | --------------------------- |
| diagnosis                     | 诊断              | string                      |
| diagnosisBasis.detailEvidence | 诊断依据-详细证据 | string                      |
| diagnosisBasis.basis          | 诊断依据-依据     | string                      |
| possibleCauses                | 可能病因          | string                      |
| sleepPrescription             | 睡眠处方          | string                      |
| scalesData                    | 量表数据          | object (optional, nullable) |
| prediction                    | 年龄预测          | object                      |
| referenceGuidelines           | 引用指南          | array                       |
| sleepStageDistributionChart   | 睡眠分期分布图    | string (optional, nullable) |
| createdAt                     | 创建时间          | string                      |
| sleepTotalDurationHour        | 睡眠总时长(小时)  | float (optional, nullable)  |
| sleepEfficiency               | 睡眠效率          | float (optional, nullable)  |

**scalesData fields (when present):**

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

**prediction fields:**

| 字段                       | 标签         | 类型                        |
| -------------------------- | ------------ | --------------------------- |
| actualAge                  | 实际年龄     | number                      |
| physiologicalAgePrediction | 生理年龄预测 | number (optional, nullable) |

**referenceGuidelines 字段：**

| 字段        | 标签     | 类型   |
| ----------- | -------- | ------ |
| name        | 指南名称 | string |
| description | 指南描述 | string |

---

## Error Responses

### 400 请求错误
```json
{
  "error": "Validation error message"
}
```

### 404 未找到
```json
{
  "error": "Resource not found"
}
```

### 500 服务器内部错误
```json
{
  "error": "Internal server error"
}
```
