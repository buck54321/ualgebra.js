// The MIT License

// Copyright (c) 2011 Pedro http://lamehacks.net

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
    
// This is actually an object-oriented version of ualgebra.js at https://github.com/plainas/ualgebra.js

function Ualgebra(){
    var self = this;
    this.matrixMultiply = function(a,b){
        var btrans = self.transposeMatrix(b);
        var result = [];
        for(var i=0; i < a.length; i++){
            var row = [];
            for(var j=0; j < btrans.length; j++){
                var value = self.internalProduct(a[i],btrans[j]);
                row.push(value)
            }
            result.push(row);
        }
        return result;
    }
    this.matrixScalarMultiply = function(m,s){
        var result = [];
        for(var i=0; i < m.length; i++){
            var row = [];
            for(var j=0; j < m[0].length; j++){
                row.push(s * m[i][j]);
            }
            result.push(row);
        }
        return result;
    }
    this.matrixAdd = function(a,b){
        var result = [];
        for(var i=0; i < a.length; i++){
            var row = [];
            for(var j=0; j < a[0].length; j++){
                row.push(a[i][j] + b[i][j]);
            }
            result.push(row);
        }
        return result;
    }
    this.internalProduct = function(u,v){
        if (u.length != v.length) throw "SizesDoNotMatch";
        var sum = 0;
        for(var i=0; i < u.length; i++){
            sum += u[i]*v[i];
        }
        return sum;
    }
    this.transposeMatrix = function(m){
        var t = [];
        for(var i=0; i < m[0].length; i++){
            var row = [];
            for(var j=0; j < m.length; j++){
                row.push(m[j][i]);
            }
            t.push(row);
        }
        return t;
    }
    this.minorMatrix = function(m, k, l){
        var reduced = [];
        for(var i=0; i < m.length; i++){
            if(i==k) continue;
            var row = [];
            for(var j=0; j < m.length; j++){
                if(j==l) continue;
            row.push(m[i][j])
            }
            reduced.push(row);
        }
        return reduced;
    }
    this.determinant = function(m){
        var size = m.length;
        if(size == 1) return m[0][0];
        if(size == 2) return m[0][0] * m[1][1] - m[0][1] * m[1][0];
        var det = 0;
        for(var i=0; i < size; i++){
            var minor = self.minorMatrix(m,0,i);
            var signal = (i%2 > 0) ? -1 : 1;
            det += signal * m[0][i]* self.determinant(minor);
        }
        return det;
    }
    this.cofactor = function(m, k, l){
        minor = self.minorMatrix(m, k, l);
        return self.determinant(minor);
    }
    this.cofactorMatrix = function(m){
        var cofactors = [];
        for(var i = 0; i < m.length; i++){
            var row = [];
            for(var j = 0; j < m.length; j++){
                var cofactorval = self.cofactor(m,i,j)*Math.pow(-1,i+j);
                row.push(cofactorval);
            }
            cofactors.push(row);
        }
        return cofactors;
    }
    this.inverseMatrix = function(m){
        var det = self.determinant(m);
        if (det == 0) throw "SingularMatrix";
        var deti = 1 / det;
        var cof = self.cofactorMatrix(m);
        var adj = self.transposeMatrix(cof);
        var result = self.matrixScalarMultiply(adj,deti);
        return result;
    }
    /*
    performs operation element by element between to matrices
    */
    this.dotOp = function(func,m,n){
        var result = [];
        for(var i = 0; i < m.length; i++){
            var row = [];
            for(var j = 0; j < m[0].length; j++){
                row.push(func(m[i][j], n[i][j]));
            }
            result.push(row);
        }
        return result;
    }
    this.zeros = function(nlines,ncols){
        return self.generateMatrix(nlines,ncols, function(i,j){return 0;});
    }
    this.ones = function(nlines,ncols){
        return self.generateMatrix(nlines,ncols, function(i,j){return 1;});
    }

    this.identity = function(size){
        return self.generateMatrix(size, size, function(i,j){ if(i===j) return 1; return 0; });
    }
}
