# **Wordle Answers API & Dashboard**

**A simple application that fetches and displays the daily Wordle solution.**

**Visit a live demo: [https://wordle.dwait.dev/](https://wordle.dwait.dev/)**

## **Features**
- **Dashboard**: View today's Wordle solution and puzzle number.
- **REST API**: Get Wordle data as JSON (/api).
- **Historical Data**: Fetch any past Wordle using a date parameter (/api?date=YYYY-MM-DD).

## **API Usage**

### **Get Today's Wordle**
`GET /api`

### **Get Specific Date**
`GET /api?date=YYYY-MM-DD`

**Example Response:**
```json
{
  "id": xxxx,
  "print_date": "YYYY-MM-DD",
  "solution": "answer",
  "editor": "First Last"
}
```

## **Development**

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the app**:
   ```bash
   npm run dev
   ```
