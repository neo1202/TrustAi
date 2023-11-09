// steps config: the shown label on the stepper button 
const trainingStepsConfig = [
  "Initial Setup",
  "Method Select",
  "UserTypeLabelPage",
  "Result",
  "Knowledge Distill",
  "Shap Explanation",
];

const DQStepsConfig = [
  "EDA(edash return)",
  "Imputer Select",
  "DQ Result",
]

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
    trainingStepsConfig, 
    DQStepsConfig, 
    initialDatasetSelectMethod,
    models,
    uncertaintyQueryMethod,
}
