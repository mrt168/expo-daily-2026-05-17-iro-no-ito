// utils/shareUtils.ts
import { RefObject } from 'react';
import { Alert, Platform } from 'react-native';
import * as Sharing from 'expo-sharing';
import { captureRef } from 'react-native-view-shot';

export async function shareViewAsPng(
  ref: RefObject<any>,
  fileName = 'iro-no-ito.png'
): Promise<void> {
  try {
    const uri = await captureRef(ref, { format: 'png', quality: 1 });
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri, {
        mimeType: 'image/png',
        dialogTitle: '#色の糸 #IroNoIto',
        UTI: 'public.png',
      });
    } else if (Platform.OS === 'web') {
      // ブラウザでは URI を新しいタブで開くだけ
      // @ts-ignore
      window.open(uri, '_blank');
    } else {
      Alert.alert('共有不可', 'この端末では共有できません');
    }
  } catch (e: any) {
    Alert.alert('共有に失敗', e?.message || '不明なエラー');
  }
}

export const SHARE_HASHTAGS = '#色の糸 #IroNoIto';
