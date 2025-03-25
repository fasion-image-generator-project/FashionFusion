# FashionFusion

FashionFusion is a web application that generates and transforms fashion images based on text prompts.

## Key Features

- 🎨 Text Prompt-Based Image Generation
- 🔄 Various Style Transformations (CycleGAN, StyleGAN)
- 🔍 Image Zoom In/Out Functionality
- 📱 Responsive Design
- 🌓 Dark Mode Support
- 📋 Generation History Management (Save, Load, Export)
- ♿ Accessibility Support (ARIA attributes)

## Getting Started

### Prerequisites

- Node.js 16.0.0 or higher
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/FashionFusion.git
cd FashionFusion
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Run development server
```bash
npm run dev
# or
yarn dev
```

## How to Use

1. Enter Text Prompt
   - Input text describing your desired fashion item
   - Example: "yellow T-shirt", "blue denim jacket"

2. Generate Image
   - Click the 'Generate' button to create the initial image
   - Generated images can be examined using zoom in/out feature

3. Style Transformation
   - Select desired transformation model (CycleGAN-turbo, CycleGAN, StyleGAN)
   - Click 'style transform' button to transform the image
   - Transformed images can be downloaded in PNG format

4. History Management
   - Generated images are automatically saved to history
   - History can be exported and imported in JSON format
   - Previous generations can be restored or deleted

## Tech Stack

- React
- Styled Components
- LocalStorage (History Storage)

## Accessibility

- ARIA labels and roles applied to all interactive elements
- Keyboard navigation support
- Screen reader compatibility

## Development Mode

During development, you can set the `USE_DUMMY_DATA` constant to `true` to use dummy images.

## License

MIT License

## Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request 