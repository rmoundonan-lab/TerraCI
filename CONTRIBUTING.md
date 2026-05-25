# Contributing to TerraCI

Nous apprécions votre intérêt pour contribuer à TerraCI! Ce document fournit des directives et des processus pour contribuer au projet.

## Code de Conduite

Veuillez noter que ce projet a un [Code de Conduite](CODE_OF_CONDUCT.md). En participant, vous acceptez d'adhérer à ses conditions.

## Comment Contribuer

### Signaler des Bugs

Ant de créer un signalement de bug, vérifiez la liste des problèmes car il est possible qu'un rapport similaire existe.

Lorsque vous signalez un bug, incluez:
- **Description claire** du problème
- **Étapes pour le reproduire**
- **Comportement attendu**
- **Comportement observé**
- **Screenshots** si applicable
- **Environnement** (OS, Node version, etc.)

### Suggesting Enhancements

Les suggestions d'améliorations sont toujours bienvenues. Veuillez inclure:
- **Description claire** de la fonctionnalité
- **Cas d'usage** et bénéfices
- **Alternative** envisagées

### Pull Requests

1. **Fork** le projet
2. **Créez une branche** (`git checkout -b feature/AmazingFeature`)
3. **Committez vos changements** (`git commit -m 'Add some AmazingFeature'`)
4. **Poussez vers la branche** (`git push origin feature/AmazingFeature`)
5. **Ouvrez une Pull Request**

### Guidelines Pull Request

- Les noms des branches doivent être explicites: `feature/...`, `fix/...`, `docs/...`
- Les commits doivent être atomiques et bien décrits
- Le code doit respecter les standards du projet
- Ajoutez des tests pour les nouvelles fonctionnalités
- Mettez à jour la documentation si nécessaire

## Standards de Code

### JavaScript/Node.js

```javascript
// Use const by default
const myVar = 'value';

// Use async/await
async function fetchData() {
  try {
    const data = await api.get('/endpoint');
    return data;
  } catch (error) {
    console.error(error);
  }
}

// Proper error handling
router.post('/endpoint', (req, res, next) => {
  try {
    // Logic here
  } catch (error) {
    next(error);
  }
});
```

### React

```javascript
// Use functional components
function MyComponent() {
  const [state, setState] = useState(null);

  return <div>{state}</div>;
}

// Proper prop types
MyComponent.propTypes = {
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func
};
```

## Linting

```bash
# Backend
cd backend
npm run lint
npm run format

# Frontend
cd frontend
npm run lint
npm run format
```

## Testing

Assurez-vous que tous les tests passent:

```bash
npm test
```

## Licence

En contribuant à TerraCI, vous acceptez que vos contributions soient sous la licence MIT.

---

Merci de votre contribution! 🎉
