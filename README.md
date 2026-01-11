# 🔭 OptiLens: AI Model Optimization Visualized

An interactive educational platform built with **React** to demystify the three pillars of efficient AI: **Quantization**, **Pruning**, and **Knowledge Distillation**.

## 🚀 Modules

### 1. Quantization (The precision reducer)
Map continuous real-world values (FP32) to efficient integers (INT8).
*   **Interactive Number Line**: Drag values to see them "snap" to buckets.
*   **Modes**: Compare Symmetric vs Asymmetric quantization.
*   **Microscope**: Visualize the exact quantization error.
*   **Real-world Presets**: Simulate Weights ($[-3,3]$) or Activations ($[0,6]$).

### 2. Pruning (The weight cutter)
Make models smaller and faster by removing redundant connections.
*   **Matrix Visualizer (Unstructured)**: See how individual weights are zeroed out (sparse matrices).
*   **Graph Visualizer (Structured)**: Watch entire neurons disappear (physically smaller models).
*   **Trade-off Graph**: Interactive simulation of Accuracy vs Speedup on CPU vs NPU.

### 3. Knowledge Distillation (The teacher-student transfer)
Train a small "Student" model to mimic a large "Teacher".
*   **Temperature Lab**: Discover "Dark Knowledge" by melting probability distributions with Temperature ($T$).
*   **Training Loop Visual**: Animated flow of the Teacher-Student architecture.
*   **Total Loss**: Visualize the combination of Soft Labels (KL Divergence) and Hard Labels (Cross Entropy).

## 🛠️ Stack

*   **React 18** (UI Framework)
*   **Vite** (Build Tool)
*   **Framer Motion** (Smooth Animations)
*   **TailwindCSS** (Styling)
*   **React Router** (Navigation)

## 🏃‍♂️ How to Run

1.  **Clone the repo**
    ```bash
    git clone https://github.com/your-username/optilens.git
    cd optilens
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Start the dev server**
    ```bash
    npm run dev
    ```

4.  Open `http://localhost:5173` to start learning!

---
*Built with ❤️ for AI Learners*
