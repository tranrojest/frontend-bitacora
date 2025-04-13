"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { getProviderById } from "@/app/actions/provider";

interface ItemRow {
  name: string;
  type: string;
  quantity: number;
  unitPrice: string | number;
  providerId?: number;
}

interface Props {
  items: ItemRow[];
  onDelete?: (index: number) => void;
}

const typeLabels: Record<string, string> = {
  PART: "Repuesto",
  SUPPLY: "Insumo",
  ACCESSORY: "Accesorio",
  OTHER: "Otro",
};

const ItemsTable: React.FC<Props> = ({ items, onDelete }) => {
  const [providerNames, setProviderNames] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchProviderNames = async () => {
      const uniqueIds = Array.from(
        new Set(items.map((item) => item.providerId).filter(Boolean))
      );
      const nameMap: Record<string, string> = {};

      await Promise.all(
        uniqueIds.map(async (id) => {
          const result = await getProviderById(id!);
          if ("name" in result) {
            nameMap[id!] = result.name;
          } else {
            nameMap[id!] = "-";
          }
        })
      );

      setProviderNames(nameMap);
    };

    fetchProviderNames();
  }, [items]);

  const parseCurrency = (value: string | number) => {
    const number =
      typeof value === "number"
        ? value
        : Number(value.toString().replace(/[^\d]/g, ""));
    return number;
  };

  const total = items.reduce(
    (acc, item) => acc + parseCurrency(item.unitPrice) * item.quantity,
    0
  );

  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell><strong>Proveedor</strong></TableCell>
            <TableCell><strong>Nombre</strong></TableCell>
            <TableCell><strong>Tipo</strong></TableCell>
            <TableCell align="right"><strong>Cantidad</strong></TableCell>
            <TableCell align="right"><strong>Precio Unitario</strong></TableCell>
            <TableCell align="right"><strong>Subtotal</strong></TableCell>
            {onDelete && <TableCell align="center"></TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item, idx) => {
            const parsedUnitPrice = parseCurrency(item.unitPrice);
            const subtotal = parsedUnitPrice * item.quantity;
            return (
              <TableRow key={idx}>
                <TableCell>{providerNames[item.providerId || ""] || "-"}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{typeLabels[item.type] || item.type}</TableCell>
                <TableCell align="right">{item.quantity}</TableCell>
                <TableCell align="right">
                  {parsedUnitPrice.toLocaleString("es-CL", {
                    style: "currency",
                    currency: "CLP",
                  })}
                </TableCell>
                <TableCell align="right">
                  {subtotal.toLocaleString("es-CL", {
                    style: "currency",
                    currency: "CLP",
                  })}
                </TableCell>
                {onDelete && (
                  <TableCell align="center">
                    <IconButton onClick={() => onDelete(idx)} size="small">
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={5} align="right">
              <strong>Total</strong>
            </TableCell>
            <TableCell align="right">
              <strong>
                {total.toLocaleString("es-CL", {
                  style: "currency",
                  currency: "CLP",
                })}
              </strong>
            </TableCell>
            {onDelete && <TableCell />}
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
};

export default ItemsTable;
