// Minimal static translations for LoginPage -- Expand as needed for real app
declare const _translations: Record<string, Record<string, string>>;

const translations: Record<string, Record<string, string>> = {
  en: {
    'login.title': 'Sign in to your account',
    'login.username': 'Username',
    'login.password': 'Password',
    'login.button': 'Sign In',
    'login.loading': 'Signing in...',
    'login.language': 'Language',
    'login.error': 'Login failed. Please check your credentials.'
  },
  es: {
    'login.title': 'Iniciar sesión en su cuenta',
    'login.username': 'Usuario',
    'login.password': 'Contraseña',
    'login.button': 'Iniciar Sesión',
    'login.loading': 'Iniciando sesión...',
    'login.language': 'Idioma',
    'login.error': 'Error de inicio de sesión. Revise sus credenciales.'
  },
  fr: {
    'login.title': 'Connectez-vous à votre compte',
    'login.username': "Nom d'utilisateur",
    'login.password': 'Mot de passe',
    'login.button': 'Connexion',
    'login.loading': 'Connexion en cours...',
    'login.language': 'Langue',
    'login.error': "Échec de la connexion. Vérifiez vos informations d'identification."
  }
};

export default translations;
