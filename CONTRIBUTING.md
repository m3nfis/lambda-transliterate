# 🤝 Contributing Guide

Thank you for your interest in contributing to the Multi-Script Transliteration Service! This guide will help you get started.

## 🎯 Project Goals

Our mission is to provide **100% accurate transliteration** for names across all major writing systems. We maintain:

- **100% Test Pass Rate** - All 1,618 tests must pass
- **High Performance** - Sub-second response times
- **Production Quality** - Enterprise-ready reliability
- **Comprehensive Coverage** - Support for all major scripts

## 🚀 Quick Start

### 1. Fork and Clone
```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/your-username/lambda-transliterate.git
cd lambda-transliterate
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Tests
```bash
# Run all tests
npm test

# Run specific script tests
node test-runner.js --script=arabic
```

### 4. Make Changes
```bash
# Create a feature branch
git checkout -b feature/your-feature-name

# Make your changes
# Test thoroughly
npm test

# Commit with semantic messages
git commit -m "feat: add support for new script"
```

## 📋 Development Guidelines

### Code Style
- **JavaScript**: Use ES6+ features
- **Indentation**: 2 spaces
- **Line Length**: 80 characters max
- **Comments**: JSDoc for functions
- **Naming**: camelCase for variables, PascalCase for classes

### File Structure
```
lambda-transliterate/
├── transliterationService.js          # Main service
├── {script}TransliterationService.js  # Script-specific services
├── test-data.json                     # Test data (source of truth)
├── test-runner.js                     # Test runner
├── package.json                       # Dependencies
├── serverless.yml                     # AWS configuration
└── docs/                              # Documentation
```

### Testing Requirements
- **100% Pass Rate**: All existing tests must pass
- **New Test Cases**: Add tests for new functionality
- **Edge Cases**: Test boundary conditions
- **Performance**: Ensure sub-second response times

## 🔧 Adding New Scripts

### 1. Create Service Module
Create `{script}TransliterationService.js`:

```javascript
const fs = require('fs');

class ScriptTransliterationService {
  constructor() {
    this.isInitialized = true;
  }

  detectScript(text) {
    // Script detection logic
  }

  async transliterateName(name, nameType) {
    // Transliteration logic
  }

  async transliterate(input) {
    // Main transliteration method
  }
}

module.exports = ScriptTransliterationService;
```

### 2. Update Main Service
Add routing in `transliterationService.js`:

```javascript
case 'XX': // Country code
  return await this.transliterateScript(input);
```

### 3. Add Test Data
Update `test-data.json` with new script:

```json
{
  "testCases": {
    "script_name": {
      "country": "XX",
      "script": "Script",
      "names": [
        {
          "firstName": "Name",
          "lastName": "Name",
          "expected": {
            "firstName": "Transliterated",
            "lastName": "Transliterated"
          }
        }
      ]
    }
  }
}
```

### 4. Add Tests
Create comprehensive test cases:
- Common names (50+)
- Complex names (50+)
- Edge cases (20+)
- Error conditions (10+)

## 🧪 Testing Guidelines

### Test Categories
1. **Exact Matches** - Names in test-data.json
2. **Library Fallbacks** - Names requiring transliteration
3. **Edge Cases** - Empty names, special characters
4. **Error Handling** - Invalid inputs, missing data

### Test Data Requirements
- **Minimum 200 names** per script
- **Real-world examples** from native speakers
- **Multiple name types** (first names, last names)
- **Various complexities** (simple to complex)

### Running Tests
```bash
# All tests
npm test

# Specific script
node test-runner.js --script=arabic

# Individual test
node -e "
const service = require('./transliterationService');
service.transliterate({
  firstName: 'test',
  lastName: 'test',
  country: 'XX'
}).then(console.log);
"
```

## 📝 Documentation

### Required Updates
- **README.md** - Update features and examples
- **FINAL-SUCCESS-SUMMARY.md** - Update metrics
- **DEPLOYMENT.md** - Update if needed
- **Inline Comments** - Document complex logic

### Documentation Standards
- **Clear Examples** - Show input/output
- **Code Snippets** - Include working code
- **Screenshots** - For UI changes
- **Links** - Reference related documentation

## 🔄 Pull Request Process

### 1. Prepare Your PR
```bash
# Ensure all tests pass
npm test

# Check code style
npm run lint

# Update documentation
# Update test data if needed
```

### 2. Create Pull Request
- **Title**: Clear, descriptive title
- **Description**: Detailed explanation of changes
- **Fixes**: Link to issues if applicable
- **Tests**: Confirm all tests pass
- **Documentation**: Confirm docs updated

### 3. PR Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] All tests pass
- [ ] New tests added
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] No breaking changes
```

## 🐛 Bug Reports

### Bug Report Template
```markdown
## Bug Description
Clear description of the issue

## Steps to Reproduce
1. Step 1
2. Step 2
3. Step 3

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- Node.js version:
- OS:
- Browser (if applicable):

## Additional Information
Screenshots, logs, etc.
```

## 💡 Feature Requests

### Feature Request Template
```markdown
## Feature Description
Clear description of the feature

## Use Case
Why this feature is needed

## Proposed Solution
How to implement the feature

## Alternatives Considered
Other approaches considered

## Additional Information
Screenshots, mockups, etc.
```

## 🏷️ Commit Message Guidelines

### Format
```
type(scope): description

[optional body]

[optional footer]
```

### Types
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes
- **refactor**: Code refactoring
- **test**: Test changes
- **chore**: Build/tool changes

### Examples
```
feat(arabic): add support for Egyptian Arabic names
fix(japanese): resolve kuroshiro initialization issue
docs(readme): update installation instructions
test(korean): add 50 new test cases
```

## 🔍 Code Review Process

### Review Checklist
- [ ] Code follows style guidelines
- [ ] Tests pass (100% success rate)
- [ ] Documentation updated
- [ ] No security issues
- [ ] Performance acceptable
- [ ] Error handling adequate

### Review Comments
- **Be constructive** - Provide helpful feedback
- **Be specific** - Point to exact lines/issues
- **Be respectful** - Maintain professional tone
- **Suggest solutions** - Offer alternatives when possible

## 🚨 Emergency Fixes

### Hotfix Process
1. **Create hotfix branch** from main
2. **Make minimal changes** to fix issue
3. **Test thoroughly** - ensure no regressions
4. **Deploy immediately** if critical
5. **Create follow-up PR** for proper review

### Rollback Plan
```bash
# Rollback to previous version
git checkout <previous-commit>
npm run deploy:prod

# Or use serverless rollback
serverless rollback --stage=production
```

## 🎉 Recognition

### Contributors
- **Code Contributors** - Listed in contributors
- **Test Data Contributors** - Acknowledged in docs
- **Documentation Contributors** - Listed in README
- **Bug Reporters** - Acknowledged in releases

### Contribution Levels
- **Bronze**: 1-5 contributions
- **Silver**: 6-20 contributions
- **Gold**: 21+ contributions
- **Platinum**: Major features/architectural changes

## 🆘 Getting Help

### Resources
- **Documentation**: README.md, DEPLOYMENT.md
- **Issues**: GitHub issues for bugs/features
- **Discussions**: GitHub discussions for questions
- **Wiki**: Project wiki for detailed guides

### Contact
- **Maintainers**: @project-maintainers
- **Community**: GitHub discussions
- **Emergency**: Create urgent issue

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to global name transliteration! 🌍** 