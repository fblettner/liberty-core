/*
 * Copyright (c) 2025 NOMANA-IT and/or its affiliates.
 * All rights reserved. Use is subject to license terms.
 * *
 */
import styled from "@emotion/styled";
import { Button } from "@ly_common/Button";

export const Button_Popper = styled(Button)(({ theme, variant }) => ({
    position: "absolute",
    bottom: 10,
    right: 10,
  }));