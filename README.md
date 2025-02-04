# Trust AI & Data Quality Pipeline

## Overview
Trust AI & Data Quality Pipeline is a comprehensive framework designed to enhance **data quality** (DQ) and integrate **explainable AI** (XAI) methodologies. It addresses challenges in real-world data processing and model reliability by establishing automated workflows that optimize data preprocessing, boost interpretability, and enable robust decision-making.

### Key Features
1. **Data Quality Enhancement**  
   - Implements both parametric and non-parametric imputation methods such as Optimized Fuzzy C-Means (OFCM) and other ML/DL-based approaches.  
   - Evaluates imputation effectiveness using metrics like Differential Entropy, Canonical Relative Entropy, and JS-Divergence.  

2. **Explainable AI (XAI) Framework**  
   - **Active Learning**: Adapts dynamically to user requirements while ensuring efficient labeling through knowledge distillation.  
   - **SHAP Interpretability**: Provides feature-level importance explanations.  
   - **Counterfactual Explanations**: Offers actionable insights by generating alternative scenarios that would lead to different predictions.

3. **Pipeline Automation**  
   - Combines the data quality module (EDASH) and XAI components to automate end-to-end workflows, ensuring reliable and interpretable AI solutions.

---

## Architecture

### Data Quality Module: EDASH
1. **Imputation Algorithms**  
   - **Optimized Fuzzy C-Means (OFCM)**: Incorporates weighting factors to optimize cluster accuracy and minimize overfitting.  
   - Other methods include Expectation-Maximization and MissForest.

2. **Evaluation Metrics**  
   - **Differential Entropy**: Measures data distribution before and after imputation.  
   - **JS-Divergence**: Quantifies similarities between datasets.  
   - **NRMSE (Normalized Root Mean Square Error)**: Assesses reconstruction quality.

---

### Trust AI: Explainable AI (XAI) Modules
1. **Active Learning**  
   - **Query Strategy**: Includes uncertainty-based sampling and margin sampling to optimize labeled data acquisition.  
   - **Human Annotation**: Ensures high-confidence labeling for critical datasets.

2. **SHAP (Shapley Additive Explanations)**  
   - Visualizes feature importance to highlight model decision logic.  
   - Enhances trust by presenting interpretable insights to users.

3. **Counterfactual Explanations**  
   - Provides "what-if" scenarios to facilitate decision-making by adjusting critical feature values.

---

### Case Study: Gas Sensor Dataset
- Achieved an F1 score of 0.9928 in predictive tasks.  
- Imputation tests demonstrated superior reconstruction accuracy using OFCM, outperforming baseline methods by >20%.  
- Active Learning reduced labeling costs by >30% while maintaining high model accuracy.

---

## Demo

### Demo Video
[Watch the Demo Video](https://drive.google.com/file/d/139Pvr70YTwli5xncJ-YmR7Yg80sOhYu2/view?usp=sharing)

### Website Preview
![Upload Page Screenshot](./image/upload_page.png)

---

## Implementation Details

### Technology Stack
- **Frontend**: React.js with Tailwind CSS for responsive UI.  
- **Backend**: Django with PostgreSQL, containerized using Docker.  
- **Imputation Module**: Python with NumPy, SciPy, and custom ML algorithms.

---

## Running the System

### Frontend:
```bash
cd frontend
npm install
npm run dev
```
- Accessible at: `http://localhost:5173`

### Backend & Database:
```bash
cd backend
docker compose up --build
```
- Django API runs on: `http://127.0.0.1:8000`

---

## References
1. **EDASH Repository**: [GitHub - EDASH](https://github.com/forbes110/EDASH)  
2. **Presentation Materials**: [Poster](./image/Poster.png)
