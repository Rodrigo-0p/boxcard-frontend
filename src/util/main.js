import * as React from 'react';
import _ from 'underscore';
import { Request } from '../service/api'
import {
  Form, Input, Button, Alert, Card, Typography, Avatar,
  Tag, Space, Empty, Spin, Modal, Table, Layout,
  Select, Upload, Switch, InputNumber, Image, Tooltip, Badge,
  Checkbox, Row, Col, Divider, Segmented,
  Statistic, Descriptions, Timeline, Pagination, Progress
} from 'antd';
import SinAcceso from '../components/hook/Acceso/SinAcceso';
import usePermisos from '../components/hook/Permisos/usePermisos';
import Pages from '../components/hook/pagination/Pages';
import { DashboardSkeleton } from '../components/hook/Skeleton/DashboardSkeleton';

import { useAuth } from '../context/AuthContext';
import {
  EmpresaSkeleton
  , EmpresaCardSkeleton
  , EmpresaToolbarSkeleton
} from '../components/hook/Skeleton/Empresa/EmpresaSkeleton';
import {
  PersonaSkeleton
  , PersonaCardSkeleton
  , PersonaToolbarSkeleton
} from '../components/hook/Skeleton/Persoana/PersonaSkeleton';
import { SolicitudSkeleton, SolicitudSkeletonGrid } from '../components/hook/Skeleton/Solicitud/SolicitudSkeleton';
import { BeneficiarioSkeleton, BeneficiarioSkeletonGrid } from '../components/hook/Skeleton/Beneficiario/BeneficiarioSkeleton';
import { useMessage } from '../components/hook/useMessage/useMessage';
import ImgCrop from 'antd-img-crop';
// Algoritmos alternativos para generar abreviaciones
const generateAbbreviation = (fullLabel, maxLength = 2) => {
  if (!fullLabel) return 'XX';

  const cleanLabel = fullLabel.replace(/[^a-zA-Z\s]/g, '').trim();
  const words = cleanLabel.split(/\s+/).filter(word => word.length > 0);

  if (words.length === 1) {
    // Para una palabra, usar consonantes principales o primeras letras
    const word = words[0].toUpperCase();
    const consonants = word.replace(/[AEIOU]/g, '');

    if (consonants.length >= maxLength) {
      return consonants.substring(0, maxLength);
    }
    return word.substring(0, maxLength);
  }

  // Para múltiples palabras, priorizar palabras importantes
  const importantWords = words.filter(word =>
    !['de', 'del', 'la', 'el', 'y', 'o', 'con', 'sin'].includes(word.toLowerCase())
  );

  const wordsToUse = importantWords.length > 0 ? importantWords : words;

  return wordsToUse
    .slice(0, maxLength)
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase();
};
const nvl = (value, defaultValue) => {
  return (value !== null && value !== undefined && value !== "") ? value : defaultValue;
}
const findMenuPath = (menuItems, targetKey, currentPath = []) => {
  const searchKey = String(targetKey);

  for (const item of menuItems) {
    if (String(item.key) === searchKey) {
      return currentPath;
    }

    if (item.children && item.children.length > 0) {
      const found = findMenuPath(item.children, searchKey, [...currentPath, item.key]);
      if (found) return found;
    }
  }
  return null;
};
const useMenuNavigation = (currentMenuKey) => {
  const { menus } = useAuth();

  const openKeys = React.useMemo(() => {
    if (!currentMenuKey || !menus) return [];
    const result = findMenuPath(menus, currentMenuKey);
    return result || [];
  }, [currentMenuKey, menus]);

  return {
    selectedMenuKey: String(currentMenuKey), // También convertir selectedKey
    openMenuKeys: openKeys
  };
};

const normalize = (str) => str?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

const soloNumero = (e) => {
  // Permitir teclas de control
  const teclasPermitidas = [
    'Backspace',
    'Delete',
    'ArrowLeft',
    'ArrowRight',
    'Tab'
  ];

  if (teclasPermitidas.includes(e.key)) return;

  // Permitir solo números
  if (!/^[0-9-]$/.test(e.key)) {
    e.preventDefault();
  }
};


const main = {
  // LIBRERIA
  Form
  , Input
  , Button
  , Alert
  , Spin
  , useMessage
  , Card
  , Typography
  , Tag
  , Space
  , Empty
  , Avatar
  , Modal
  , Table
  , Layout
  , Select
  , Upload
  , Switch
  , ImgCrop
  , InputNumber
  , Image
  , Tooltip
  , Badge
  , _
  , Checkbox
  , Row
  , Col
  , Divider
  , Statistic
  , Descriptions
  , Timeline
  , Pagination
  , Progress
  , Segmented
  // HOOT Skeleton
  , DashboardSkeleton
  , EmpresaCardSkeleton
  , EmpresaSkeleton
  , EmpresaToolbarSkeleton
  , PersonaSkeleton
  , PersonaCardSkeleton
  , PersonaToolbarSkeleton
  , SolicitudSkeleton
  , SolicitudSkeletonGrid
  , BeneficiarioSkeleton
  , BeneficiarioSkeletonGrid
  , usePermisos
  , useAuth
  , Pages
  , SinAcceso
  , soloNumero
  // FUNCION
  , nvl
  , Request
  , generateAbbreviation
  , useMenuNavigation
  , normalize
}

export default main;