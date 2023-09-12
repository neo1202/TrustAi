const stepsConfig = [
  "Initial Setup",
  "Method Select",
  "UserTypeLabelPage",
//   "Training Process",
  "Result",
  "Knowledge Distill",
//   "KD Result",
  "Shap Explanation",
];

const initialDatasetSelectMethod = [
    'Randomly Generate',
    'Assign Indices', // not necessarily full number of ids, including those assigned is fine
]

const models = [
    '3 Layer Neural Network Model',
    'N Layer Neural Network Model',
    'Resnet 18 Pretrained',
]

const uncertaintyQueryMethod = [
    'Confidence',
    'Margin',
    'Random'
]

export {
    stepsConfig, 
    initialDatasetSelectMethod,
    models,
    uncertaintyQueryMethod,
}
