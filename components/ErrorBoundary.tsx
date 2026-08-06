import { Component, type ReactNode } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FontFamily, MainColors } from '@/constants/theme';

type Props = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
};

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch() {
    // No crash reporting service is configured for this app; the fallback
    // UI below is the only signal a volunteer needs to act on.
  }

  handleRestart = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <SafeAreaView style={styles.safe}>
          <View style={styles.content}>
            <Text style={styles.title}>Something went wrong</Text>
            <Text style={styles.body}>
              Tap Restart to reload the exhibit. If this keeps happening, close and reopen the app.
            </Text>
            <TouchableOpacity
              style={styles.restartButton}
              onPress={this.handleRestart}
              activeOpacity={0.88}
              accessibilityRole="button"
              accessibilityLabel="Restart"
            >
              <Text style={styles.restartLabel}>Restart</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: MainColors.backgroundBeige,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 48,
    gap: 20,
  },
  title: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '800',
    color: MainColors.pointRed,
    fontFamily: FontFamily.khula,
    textAlign: 'center',
  },
  body: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '400',
    color: MainColors.primaryBlack,
    fontFamily: FontFamily.interMedium,
    textAlign: 'center',
  },
  restartButton: {
    marginTop: 8,
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 40,
    backgroundColor: MainColors.pointRed,
  },
  restartLabel: {
    color: '#FFFFFF',
    fontSize: 18,
    lineHeight: 24,
    fontFamily: FontFamily.interMedium,
  },
});
