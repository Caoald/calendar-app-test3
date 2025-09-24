
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
}

const iconMap: { [key: string]: keyof typeof Ionicons.glyphMap } = {
  // Navigation
  'arrow-left': 'arrow-back',
  'arrow-right': 'arrow-forward',
  'chevron-left': 'chevron-back',
  'chevron-right': 'chevron-forward',
  'chevron-up': 'chevron-up',
  'chevron-down': 'chevron-down',
  
  // Actions
  'plus': 'add',
  'minus': 'remove',
  'close': 'close',
  'check': 'checkmark',
  'pencil': 'pencil',
  'trash': 'trash',
  'send': 'send',
  
  // Content
  'calendar': 'calendar',
  'time': 'time',
  'location': 'location',
  'users': 'people',
  'user': 'person',
  'message-circle': 'chatbubble',
  'chat': 'chatbubbles',
  'settings': 'settings',
  'search': 'search',
  'filter': 'filter',
  'heart': 'heart',
  'star': 'star',
  'bookmark': 'bookmark',
  'share': 'share',
  'download': 'download',
  'upload': 'cloud-upload',
  'image': 'image',
  'camera': 'camera',
  'video': 'videocam',
  'music': 'musical-notes',
  'volume': 'volume-high',
  'bell': 'notifications',
  'mail': 'mail',
  'phone': 'call',
  'globe': 'globe',
  'home': 'home',
  'menu': 'menu',
  'grid': 'grid',
  'list': 'list',
  'eye': 'eye',
  'eye-off': 'eye-off',
  'lock': 'lock-closed',
  'unlock': 'lock-open',
  'key': 'key',
  'shield': 'shield',
  'info': 'information-circle',
  'warning': 'warning',
  'error': 'alert-circle',
  'success': 'checkmark-circle',
  'help': 'help-circle',
  'refresh': 'refresh',
  'sync': 'sync',
  'wifi': 'wifi',
  'bluetooth': 'bluetooth',
  'battery': 'battery-full',
  'power': 'power',
};

export default function Icon({ name, size = 24, color = '#000' }: IconProps) {
  const ioniconsName = iconMap[name] || 'help-circle';
  
  return (
    <Ionicons 
      name={ioniconsName} 
      size={size} 
      color={color} 
    />
  );
}
